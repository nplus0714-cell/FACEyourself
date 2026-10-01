-- Expand anonymous telemetry from the test-only funnel to the public V1 path.
-- No answers, profile codes, email addresses, LINE identifiers, or message text
-- are recorded. question_step is only the 1-based progress number.

alter table public.funnel_events
  drop constraint if exists funnel_events_event_type_check;

alter table public.funnel_events
  add constraint funnel_events_event_type_check check (event_type in (
    'test_landing', 'test_started', 'test_completed',
    'quiz_landing_view', 'quiz_start', 'quiz_question_progress', 'quiz_complete',
    'result_view', 'result_share_click', 'result_feedback_click',
    'survival_guide_click', 'line_click', 'guide_access', 'guide_read_start'
  ));

alter table public.funnel_events
  add column if not exists question_step smallint
  check (question_step between 1 and 24);

create or replace function public.record_funnel_event(
  p_anonymous_visitor_id uuid,
  p_session_id uuid,
  p_event_type text,
  p_path text,
  p_step integer,
  p_has_attribution boolean default false,
  p_source text default null,
  p_medium text default null,
  p_campaign text default null,
  p_content text default null
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  normalized_source text := coalesce(nullif(lower(btrim(p_source)), ''), 'direct');
  normalized_medium text := coalesce(nullif(lower(btrim(p_medium)), ''), 'none');
  normalized_campaign text := nullif(lower(btrim(p_campaign)), '');
  normalized_content text := nullif(lower(btrim(p_content)), '');
  normalized_path text := coalesce(nullif(btrim(p_path), ''), '/test');
  event_id uuid;
begin
  if p_event_type not in (
    'quiz_landing_view', 'quiz_start', 'quiz_question_progress', 'quiz_complete',
    'result_view', 'result_share_click', 'result_feedback_click',
    'survival_guide_click', 'line_click', 'guide_access', 'guide_read_start'
  ) then
    raise exception 'invalid_funnel_event';
  end if;

  if (p_step is not null and (p_step < 1 or p_step > 24))
    or (p_event_type = 'quiz_question_progress' and p_step is null) then
    raise exception 'invalid_funnel_step';
  end if;

  if normalized_source !~ '^[a-z0-9][a-z0-9_-]{0,79}$'
    or normalized_medium !~ '^[a-z0-9][a-z0-9_-]{0,79}$'
    or normalized_path !~ '^/[a-z0-9/_-]{0,180}$'
    or (normalized_campaign is not null and normalized_campaign !~ '^[a-z0-9][a-z0-9_-]{0,119}$')
    or (normalized_content is not null and normalized_content !~ '^[a-z0-9][a-z0-9_-]{0,119}$') then
    raise exception 'invalid_funnel_attribution';
  end if;

  insert into public.funnel_attributions (
    anonymous_visitor_id, first_source, first_medium, first_campaign, first_content, first_landing_path,
    last_source, last_medium, last_campaign, last_content, last_landing_path
  ) values (
    p_anonymous_visitor_id, normalized_source, normalized_medium, normalized_campaign, normalized_content, normalized_path,
    normalized_source, normalized_medium, normalized_campaign, normalized_content, normalized_path
  )
  on conflict (anonymous_visitor_id) do update
  set last_source = case when p_has_attribution then excluded.last_source else public.funnel_attributions.last_source end,
      last_medium = case when p_has_attribution then excluded.last_medium else public.funnel_attributions.last_medium end,
      last_campaign = case when p_has_attribution then excluded.last_campaign else public.funnel_attributions.last_campaign end,
      last_content = case when p_has_attribution then excluded.last_content else public.funnel_attributions.last_content end,
      last_landing_path = case when p_has_attribution then excluded.last_landing_path else public.funnel_attributions.last_landing_path end,
      last_seen_at = now();

  insert into public.funnel_events (anonymous_visitor_id, session_id, event_type, path, question_step)
  values (p_anonymous_visitor_id, p_session_id, p_event_type, normalized_path, p_step)
  returning id into event_id;

  return event_id;
end;
$$;

revoke all on function public.record_funnel_event(uuid, uuid, text, text, integer, boolean, text, text, text, text) from public;
grant execute on function public.record_funnel_event(uuid, uuid, text, text, integer, boolean, text, text, text, text) to service_role;

create or replace view public.funnel_source_summary
with (security_invoker = true)
as
select
  attribution.first_source,
  attribution.first_medium,
  coalesce(attribution.first_campaign, '(none)') as first_campaign,
  coalesce(attribution.first_content, '(none)') as first_content,
  count(distinct attribution.anonymous_visitor_id) as acquired_visitors,
  count(*) filter (where events.event_type = 'test_landing') as test_landings,
  count(distinct events.anonymous_visitor_id) filter (where events.event_type = 'test_started') as test_starters,
  count(distinct events.anonymous_visitor_id) filter (where events.event_type = 'test_completed') as test_completers,
  round(
    count(distinct events.anonymous_visitor_id) filter (where events.event_type = 'test_completed')::numeric
    / nullif(count(distinct events.anonymous_visitor_id) filter (where events.event_type = 'test_started'), 0),
    4
  ) as completion_rate,
  count(*) filter (where events.event_type = 'quiz_landing_view') as quiz_landings,
  count(distinct events.anonymous_visitor_id) filter (where events.event_type = 'quiz_start') as quiz_starters,
  count(distinct events.anonymous_visitor_id) filter (where events.event_type = 'quiz_complete') as quiz_completers,
  count(distinct events.anonymous_visitor_id) filter (where events.event_type = 'result_view') as result_viewers,
  count(distinct events.anonymous_visitor_id) filter (where events.event_type = 'survival_guide_click') as guide_intents,
  count(distinct events.anonymous_visitor_id) filter (where events.event_type = 'line_click') as line_clickers,
  count(distinct events.anonymous_visitor_id) filter (where events.event_type = 'guide_read_start') as guide_readers,
  round(
    count(distinct events.anonymous_visitor_id) filter (where events.event_type = 'quiz_complete')::numeric
    / nullif(count(distinct events.anonymous_visitor_id) filter (where events.event_type = 'quiz_start'), 0),
    4
  ) as quiz_completion_rate
from public.funnel_attributions attribution
left join public.funnel_events events on events.anonymous_visitor_id = attribution.anonymous_visitor_id
group by attribution.first_source, attribution.first_medium, attribution.first_campaign, attribution.first_content;

comment on table public.funnel_events is
  'Anonymous FACE V1 funnel events from quiz landing through guide reading; no answers or personal identity.';

notify pgrst, 'reload schema';
