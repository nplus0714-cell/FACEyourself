-- FACE V2.5 member profile and awareness journal hardening.
-- The public FACE assessment uses anonymous Auth sessions. These two tables
-- are real-member features and must reject those anonymous sessions.

drop policy if exists "Users can create their own awareness diary entries" on public.awareness_diary_entries;
create policy "Users can create their own awareness diary entries"
  on public.awareness_diary_entries for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
  );

drop policy if exists "Users can delete their own awareness diary entries" on public.awareness_diary_entries;
create policy "Users can delete their own awareness diary entries"
  on public.awareness_diary_entries for delete to authenticated
  using (
    (select auth.uid()) = user_id
    and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
  );

drop policy if exists "Users can read their own awareness diary" on public.awareness_diary_entries;
create policy "Users can read their own awareness diary"
  on public.awareness_diary_entries for select to authenticated
  using (
    (select auth.uid()) = user_id
    and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
  );

drop policy if exists "Users can update their own awareness diary entries" on public.awareness_diary_entries;
create policy "Users can update their own awareness diary entries"
  on public.awareness_diary_entries for update to authenticated
  using (
    (select auth.uid()) = user_id
    and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
  )
  with check (
    (select auth.uid()) = user_id
    and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
  );

drop policy if exists "Users can create their own member profile" on public.member_profiles;
create policy "Users can create their own member profile"
  on public.member_profiles for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
  );

drop policy if exists "Users can read their own member profile" on public.member_profiles;
create policy "Users can read their own member profile"
  on public.member_profiles for select to authenticated
  using (
    (select auth.uid()) = user_id
    and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
  );

drop policy if exists "Users can update their own member profile" on public.member_profiles;
create policy "Users can update their own member profile"
  on public.member_profiles for update to authenticated
  using (
    (select auth.uid()) = user_id
    and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
  )
  with check (
    (select auth.uid()) = user_id
    and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
  );
