alter table public.awareness_diary_entries
  add column state_code text check (state_code in (
    'steady', 'watching', 'chasing', 'attached', 'guarded', 'resetting'
  )),
  add column answers jsonb check (answers is null or jsonb_typeof(answers) = 'object');

create index awareness_diary_entries_user_state_idx
  on public.awareness_diary_entries (user_id, entry_date desc)
  where state_code is not null;
