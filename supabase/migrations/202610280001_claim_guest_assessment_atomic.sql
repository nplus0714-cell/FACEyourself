-- A completed guest result may be claimed by several open tabs after the same
-- sign-in event. Serialize those claims in the database and reuse the first
-- completed run when its answers and scores match within a short window.
create or replace function public.claim_guest_assessment(
  p_run_id uuid,
  p_visitor_id uuid,
  p_assessment_version text,
  p_question_count integer,
  p_face_code text,
  p_scores jsonb,
  p_answers jsonb
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  member_id uuid := auth.uid();
  supplied_count integer;
  unique_count integer;
  supplied_answer_map jsonb;
  existing_run_id uuid;
begin
  if member_id is null then
    raise exception 'Authentication is required';
  end if;

  if p_run_id is null or p_visitor_id is null or p_assessment_version is null
    or p_question_count is null or p_question_count < 1 or p_question_count > 200
    or jsonb_typeof(p_answers) is distinct from 'array' then
    raise exception 'Invalid guest assessment claim';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_answers) answer
    where nullif(btrim(answer ->> 'question_code'), '') is null
      or nullif(answer ->> 'selected_option', '') is null
  ) then
    raise exception 'Invalid guest assessment answers';
  end if;

  select
    count(*),
    count(distinct btrim(answer ->> 'question_code')),
    jsonb_object_agg(btrim(answer ->> 'question_code'), answer ->> 'selected_option')
  into supplied_count, unique_count, supplied_answer_map
  from jsonb_array_elements(p_answers) answer;

  if supplied_count <> p_question_count or unique_count <> p_question_count then
    raise exception 'Expected % unique answers, received %', p_question_count, supplied_count;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(
    member_id::text || ':' || p_visitor_id::text || ':' || p_assessment_version,
    0
  ));

  select runs.id
  into existing_run_id
  from public.assessment_runs runs
  where runs.user_id = member_id
    and runs.anonymous_visitor_id = p_visitor_id
    and runs.assessment_version = p_assessment_version
    and runs.assessment_type = 'baseline'
    and runs.question_count = p_question_count
    and runs.completed_at >= now() - interval '30 seconds'
    and runs.face_code = p_face_code
    and runs.scores = p_scores
    and (
      select jsonb_object_agg(answer.question_code, answer.selected_option)
      from public.assessment_answers answer
      where answer.assessment_run_id = runs.id
    ) = supplied_answer_map
  order by runs.completed_at desc
  limit 1;

  if existing_run_id is not null then
    return existing_run_id;
  end if;

  insert into public.assessment_runs (
    id, user_id, anonymous_visitor_id, assessment_version,
    assessment_type, question_count
  ) values (
    p_run_id, member_id, p_visitor_id, p_assessment_version,
    'baseline', p_question_count
  ) on conflict (id) do nothing;

  return public.complete_assessment(p_run_id, p_face_code, p_scores, p_answers);
end;
$$;

revoke all on function public.claim_guest_assessment(uuid, uuid, text, integer, text, jsonb, jsonb) from public;
grant execute on function public.claim_guest_assessment(uuid, uuid, text, integer, text, jsonb, jsonb) to authenticated;
