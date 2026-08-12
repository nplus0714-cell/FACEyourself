-- FACE 2.0 adds graded scenario responses and an explicit unscored
-- not-applicable response. Existing v1 and legacy answers remain valid.
alter table public.assessment_answers
  drop constraint if exists assessment_answers_selected_option_check;

alter table public.assessment_answers
  add constraint assessment_answers_selected_option_check
  check (selected_option in (
    'A',
    'B',
    'very_agree',
    'somewhat_agree',
    'neutral',
    'somewhat_disagree',
    'very_disagree',
    'very_a',
    'somewhat_a',
    'balanced',
    'somewhat_b',
    'very_b',
    'not_applicable'
  ));
