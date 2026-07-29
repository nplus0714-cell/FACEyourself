-- FACE baseline 40q adds five-level agreement answers alongside legacy A/B answers.
-- Existing 20q rows remain valid and are not changed.
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
    'very_disagree'
  ));
