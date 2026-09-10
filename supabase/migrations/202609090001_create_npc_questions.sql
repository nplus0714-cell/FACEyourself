-- FACE result-page "Ask NPC" inbox.
-- Only the server-side API can write to this table; browser clients cannot read
-- or mutate it, so email addresses and messages stay private.

create extension if not exists pgcrypto;

create table if not exists public.npc_questions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  message text not null,
  face_code text not null,
  source text not null default 'face-result',
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'replied', 'archived')),
  user_id uuid references auth.users(id) on delete set null,
  consent_version text not null default 'npc-question-v1',
  consented_at timestamptz not null default now(),
  replied_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (email = lower(btrim(email))),
  check (email ~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$'),
  check (char_length(message) between 1 and 4000),
  check (face_code ~ '^[AP][RI][LT][CD]$'),
  check (char_length(source) between 1 and 100),
  check (char_length(consent_version) between 1 and 50)
);

create index if not exists npc_questions_status_created_idx
  on public.npc_questions (status, created_at desc);
create index if not exists npc_questions_email_created_idx
  on public.npc_questions (email, created_at desc);
create index if not exists npc_questions_user_created_idx
  on public.npc_questions (user_id, created_at desc)
  where user_id is not null;

alter table public.npc_questions enable row level security;
revoke all on table public.npc_questions from anon, authenticated, public;

comment on table public.npc_questions is
  'Private FACE result-page questions for NPC email follow-up.';
notify pgrst, 'reload schema';
