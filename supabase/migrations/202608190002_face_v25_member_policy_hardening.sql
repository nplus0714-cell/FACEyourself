-- FACE V2.5 member-only RLS hardening.
-- Anonymous Supabase Auth sessions are used for the public FACE assessment,
-- so member tables must explicitly exclude those sessions.

drop policy if exists "Members can read own entitlements" on public.member_entitlements;
create policy "Members can read own entitlements"
  on public.member_entitlements
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
  );

drop policy if exists "Members can insert own activity" on public.member_activity_events;
create policy "Members can insert own activity"
  on public.member_activity_events
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
  );

drop policy if exists "Members can read own activity" on public.member_activity_events;
create policy "Members can read own activity"
  on public.member_activity_events
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
  );

drop policy if exists "Members can read own content progress" on public.content_reading_progress;
create policy "Members can read own content progress"
  on public.content_reading_progress
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
  );
