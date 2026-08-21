-- Cover the optional auth.users foreign key for account deletion and joins.
create index if not exists early_access_waitlist_user_idx
  on public.early_access_waitlist (user_id)
  where user_id is not null;
