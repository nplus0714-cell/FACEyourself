-- Older result tabs may still use the two-step start/complete flow while a
-- newer auth callback uses claim_guest_assessment. Put the final idempotency
-- check at completion, where both paths meet.
create or replace function public.complete_assessment(
  p_run_id uuid,
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
  target_run public.assessment_runs%rowtype;
  supplied_answer_count integer;
  unique_question_count integer;
  supplied_answer_map jsonb;
  existing_run_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required';
  end if;

  select * into target_run
  from public.assessment_runs
  where id = p_run_id
  for update;

  if not found or target_run.user_id <> auth.uid() then
    raise exception 'Assessment run not found';
  end if;

  if target_run.completed_at is not null then
    return target_run.id;
  end if;

  if p_face_code !~ '^[AP][RI][LT][CD]$' then
    raise exception 'Invalid FACE code';
  end if;

  if jsonb_typeof(p_scores) <> 'object' then
    raise exception 'Scores must be a JSON object';
  end if;

  if not (p_scores ?& array['A', 'P', 'R', 'I', 'L', 'T', 'C', 'D'])
    or jsonb_typeof(p_scores -> 'A') <> 'number'
    or jsonb_typeof(p_scores -> 'P') <> 'number'
    or jsonb_typeof(p_scores -> 'R') <> 'number'
    or jsonb_typeof(p_scores -> 'I') <> 'number'
    or jsonb_typeof(p_scores -> 'L') <> 'number'
    or jsonb_typeof(p_scores -> 'T') <> 'number'
    or jsonb_typeof(p_scores -> 'C') <> 'number'
    or jsonb_typeof(p_scores -> 'D') <> 'number' then
    raise exception 'Scores must contain all eight numeric FACE traits';
  end if;

  if (p_scores ->> 'A')::smallint + (p_scores ->> 'P')::smallint <> 100
    or (p_scores ->> 'R')::smallint + (p_scores ->> 'I')::smallint <> 100
    or (p_scores ->> 'L')::smallint + (p_scores ->> 'T')::smallint <> 100
    or (p_scores ->> 'C')::smallint + (p_scores ->> 'D')::smallint <> 100 then
    raise exception 'Each FACE dimension must total 100';
  end if;

  if jsonb_typeof(p_answers) <> 'array' then
    raise exception 'Answers must be a JSON array';
  end if;

  select count(*),
         count(distinct btrim(answer ->> 'question_code')),
         jsonb_object_agg(btrim(answer ->> 'question_code'), answer ->> 'selected_option')
  into supplied_answer_count, unique_question_count, supplied_answer_map
  from jsonb_array_elements(p_answers) answer;

  if supplied_answer_count <> target_run.question_count
    or unique_question_count <> target_run.question_count then
    raise exception 'Expected % unique answers, received %',
      target_run.question_count, supplied_answer_count;
  end if;

  -- Serialize all completions for the same member, visitor, and assessment.
  -- This also coordinates with claim_guest_assessment's existing lock.
  perform pg_advisory_xact_lock(hashtextextended(
    target_run.user_id::text || ':' || target_run.anonymous_visitor_id::text
      || ':' || target_run.assessment_version,
    0
  ));

  select runs.id into existing_run_id
  from public.assessment_runs runs
  where runs.id <> target_run.id
    and runs.user_id = target_run.user_id
    and runs.anonymous_visitor_id = target_run.anonymous_visitor_id
    and runs.assessment_version = target_run.assessment_version
    and runs.assessment_type = target_run.assessment_type
    and runs.question_count = target_run.question_count
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
    -- The newly started run has no answers yet. Keep one completed member
    -- result and remove only this duplicate incomplete shell.
    delete from public.assessment_runs where id = target_run.id;
    return existing_run_id;
  end if;

  insert into public.assessment_answers (
    assessment_run_id, question_code, selected_option,
    dimension, score_value, answered_at
  )
  select target_run.id,
         btrim(answer ->> 'question_code'),
         answer ->> 'selected_option',
         answer ->> 'dimension',
         (answer ->> 'score_value')::smallint,
         coalesce((answer ->> 'answered_at')::timestamptz, now())
  from jsonb_array_elements(p_answers) answer;

  update public.assessment_runs
  set face_code = p_face_code,
      focus_score = ((p_scores ->> 'A')::smallint - (p_scores ->> 'P')::smallint),
      analysis_score = ((p_scores ->> 'R')::smallint - (p_scores ->> 'I')::smallint),
      cycle_score = ((p_scores ->> 'L')::smallint - (p_scores ->> 'T')::smallint),
      exposure_score = ((p_scores ->> 'C')::smallint - (p_scores ->> 'D')::smallint),
      scores = p_scores,
      completed_at = now()
  where id = target_run.id;

  return target_run.id;
end;
$$;

revoke all on function public.complete_assessment(uuid, text, jsonb, jsonb) from public;
grant execute on function public.complete_assessment(uuid, text, jsonb, jsonb) to authenticated;
