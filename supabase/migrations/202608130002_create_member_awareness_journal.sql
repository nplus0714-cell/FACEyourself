create table public.member_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 30),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.awareness_diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entry_date date not null,
  content text not null default '' check (char_length(content) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

create index awareness_diary_entries_user_date_idx
  on public.awareness_diary_entries (user_id, entry_date desc);

alter table public.member_profiles enable row level security;
alter table public.awareness_diary_entries enable row level security;

create policy "Users can read their own member profile"
  on public.member_profiles for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own member profile"
  on public.member_profiles for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own member profile"
  on public.member_profiles for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can read their own awareness diary"
  on public.awareness_diary_entries for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own awareness diary entries"
  on public.awareness_diary_entries for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own awareness diary entries"
  on public.awareness_diary_entries for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own awareness diary entries"
  on public.awareness_diary_entries for delete to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.member_profiles from anon, authenticated;
revoke all on table public.awareness_diary_entries from anon, authenticated;

grant select, insert, update on table public.member_profiles to authenticated;
grant select, insert, update, delete on table public.awareness_diary_entries to authenticated;
