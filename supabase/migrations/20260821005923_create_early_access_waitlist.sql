-- FACE V2.5 early-access waitlist v1
-- Public visitors may join through one narrowly scoped RPC. The underlying
-- table remains private to the server/dashboard and cannot be read or written
-- directly with browser credentials.

create extension if not exists pgcrypto;

create table if not exists public.early_access_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  nickname text,
  interest text,
  source text not null default 'survival-kit',
  status text not null default 'subscribed'
    check (status in ('subscribed', 'unsubscribed')),
  marketing_consent boolean not null default true
    check (marketing_consent),
  consent_version text not null default 'early-access-v1',
  marketing_consented_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (email = lower(btrim(email))),
  check (email ~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$'),
  check (nickname is null or char_length(nickname) between 1 and 30),
  check (
    interest is null
    or interest in ('full_system', 'survival_guide', 'daily_journal', 'trading_tools', 'unsure')
  ),
  check (char_length(source) between 1 and 100),
  check (char_length(consent_version) between 1 and 50)
);

create index if not exists early_access_waitlist_status_created_idx
  on public.early_access_waitlist (status, created_at desc);
create index if not exists early_access_waitlist_user_idx
  on public.early_access_waitlist (user_id)
  where user_id is not null;

alter table public.early_access_waitlist enable row level security;

-- The browser never needs direct table access. This also prevents email-list
-- enumeration even if a client modifies the application code.
revoke all on table public.early_access_waitlist from anon, authenticated;

create or replace function public.join_early_access_waitlist(
  p_email text,
  p_nickname text default null,
  p_interest text default null,
  p_source text default 'survival-kit',
  p_marketing_consent boolean default false,
  p_consent_version text default 'early-access-v1',
  p_website text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_email text := lower(btrim(coalesce(p_email, '')));
  normalized_nickname text := nullif(btrim(coalesce(p_nickname, '')), '');
  normalized_interest text := nullif(btrim(coalesce(p_interest, '')), '');
  normalized_source text := btrim(coalesce(p_source, 'survival-kit'));
begin
  -- Honeypot submissions receive a generic success response without storage.
  if nullif(btrim(coalesce(p_website, '')), '') is not null then
    return jsonb_build_object('ok', true, 'status', 'subscribed');
  end if;

  if not p_marketing_consent then
    raise exception 'marketing_consent_required' using errcode = '22023';
  end if;

  if p_consent_version is distinct from 'early-access-v1' then
    raise exception 'invalid_consent_version' using errcode = '22023';
  end if;

  if normalized_email = ''
    or normalized_email !~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$' then
    raise exception 'invalid_email' using errcode = '22023';
  end if;

  if normalized_nickname is not null and char_length(normalized_nickname) > 30 then
    raise exception 'nickname_too_long' using errcode = '22023';
  end if;

  if normalized_interest is not null
    and normalized_interest not in ('full_system', 'survival_guide', 'daily_journal', 'trading_tools', 'unsure') then
    raise exception 'invalid_interest' using errcode = '22023';
  end if;

  if normalized_source = '' or char_length(normalized_source) > 100 then
    raise exception 'invalid_source' using errcode = '22023';
  end if;

  insert into public.early_access_waitlist (
    email,
    nickname,
    interest,
    source,
    status,
    marketing_consent,
    consent_version,
    marketing_consented_at,
    unsubscribed_at,
    user_id,
    updated_at
  ) values (
    normalized_email,
    normalized_nickname,
    normalized_interest,
    normalized_source,
    'subscribed',
    true,
    'early-access-v1',
    now(),
    null,
    auth.uid(),
    now()
  )
  on conflict (email) do update
  set nickname = coalesce(excluded.nickname, public.early_access_waitlist.nickname),
      interest = coalesce(excluded.interest, public.early_access_waitlist.interest),
      source = excluded.source,
      status = 'subscribed',
      marketing_consent = true,
      consent_version = excluded.consent_version,
      marketing_consented_at = excluded.marketing_consented_at,
      unsubscribed_at = null,
      user_id = coalesce(excluded.user_id, public.early_access_waitlist.user_id),
      updated_at = now();

  -- Deliberately do not reveal whether an email was already registered.
  return jsonb_build_object('ok', true, 'status', 'subscribed');
end;
$$;

revoke all on function public.join_early_access_waitlist(
  text, text, text, text, boolean, text, text
) from public;
grant execute on function public.join_early_access_waitlist(
  text, text, text, text, boolean, text, text
) to anon, authenticated;

comment on table public.early_access_waitlist is
  'FACE early-access contacts, consent evidence, interest and acquisition source.';
comment on function public.join_early_access_waitlist(text, text, text, text, boolean, text, text) is
  'Privacy-preserving public signup endpoint for FACE early-access v1.';

notify pgrst, 'reload schema';
