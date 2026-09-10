-- First-party acquisition attribution for the FACE 24-question test.
-- This deliberately stores no answers, email addresses, IP addresses, or
-- referrer URLs. It only joins an anonymous browser UUID to UTM attribution
-- and a small set of funnel events.

create extension if not exists pgcrypto;

create table if not exists public.funnel_attributions (
  anonymous_visitor_id uuid primary key,
  first_source text not null default 'direct'
    check (first_source ~ '^[a-z0-9][a-z0-9_-]{0,79}$'),
  first_medium text not null default 'none'
    check (first_medium ~ '^[a-z0-9][a-z0-9_-]{0,79}$'),
  first_campaign text,
  first_content text,
  first_landing_path text not null default '/test'
    check (first_landing_path ~ '^/[a-z0-9/_-]{0,180}$'),
  first_seen_at timestamptz not null default now(),
  last_source text not null default 'direct'
    check (last_source ~ '^[a-z0-9][a-z0-9_-]{0,79}$'),
  last_medium text not null default 'none'
    check (last_medium ~ '^[a-z0-9][a-z0-9_-]{0,79}$'),
  last_campaign text,
  last_content text,
  last_landing_path text not null default '/test'
    check (last_landing_path ~ '^/[a-z0-9/_-]{0,180}$'),
  last_seen_at timestamptz not null default now()
);

create table if not exists public.funnel_events (
  id uuid primary key default gen_random_uuid(),
  anonymous_visitor_id uuid not null references public.funnel_attributions(anonymous_visitor_id) on delete cascade,
  session_id uuid not null,
  event_type text not null check (event_type in ('test_landing', 'test_started', 'test_completed')),
  path text not null check (path ~ '^/[a-z0-9/_-]{0,180}$'),
  occurred_at timestamptz not null default now()
);

create index if not exists funnel_events_visitor_time_idx
  on public.funnel_events (anonymous_visitor_id, occurred_at desc);
create index if not exists funnel_events_type_time_idx
  on public.funnel_events (event_type, occurred_at desc);

alter table public.funnel_attributions enable row level security;
alter table public.funnel_events enable row level security;

-- Both tables are deliberately server-only. The browser calls the API route,
-- which validates input and writes using the server-side service key.
revoke all on table public.funnel_attributions from anon, authenticated;
revoke all on table public.funnel_events from anon, authenticated;

create or replace function public.record_funnel_event(
  p_anonymous_visitor_id uuid,
  p_session_id uuid,
  p_event_type text,
  p_path text,
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
  if p_event_type not in ('test_landing', 'test_started', 'test_completed') then
    raise exception 'invalid_funnel_event';
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

  insert into public.funnel_events (anonymous_visitor_id, session_id, event_type, path)
  values (p_anonymous_visitor_id, p_session_id, p_event_type, normalized_path)
  returning id into event_id;

  return event_id;
end;
$$;

revoke all on function public.record_funnel_event(uuid, uuid, text, text, boolean, text, text, text, text) from public;
grant execute on function public.record_funnel_event(uuid, uuid, text, text, boolean, text, text, text, text) to service_role;

create or replace view public.funnel_source_summary
with (security_invoker = true)
as
select
  attribution.first_source,
  attribution.first_medium,
  coalesce(attribution.first_campaign, '(none)') as first_campaign,
  coalesce(attribution.first_content, '(none)') as first_content,
  count(*) as acquired_visitors,
  count(*) filter (where events.event_type = 'test_landing') as test_landings,
  count(distinct events.anonymous_visitor_id) filter (where events.event_type = 'test_started') as test_starters,
  count(distinct events.anonymous_visitor_id) filter (where events.event_type = 'test_completed') as test_completers,
  round(
    count(distinct events.anonymous_visitor_id) filter (where events.event_type = 'test_completed')::numeric
    / nullif(count(distinct events.anonymous_visitor_id) filter (where events.event_type = 'test_started'), 0),
    4
  ) as completion_rate
from public.funnel_attributions attribution
left join public.funnel_events events on events.anonymous_visitor_id = attribution.anonymous_visitor_id
group by attribution.first_source, attribution.first_medium, attribution.first_campaign, attribution.first_content;

revoke all on public.funnel_source_summary from anon, authenticated;

comment on table public.funnel_attributions is
  'First-touch and latest-touch UTM attribution for anonymous FACE test visitors; no answers or personal identity.';
comment on table public.funnel_events is
  'Anonymous FACE test funnel events: landing, start, completion.';
comment on view public.funnel_source_summary is
  'Admin-only first-touch acquisition summary for the FACE test funnel.';

notify pgrst, 'reload schema';
