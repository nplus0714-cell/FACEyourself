create table public.research_submission_reviews (
  submission_id uuid primary key references public.research_submissions (id) on delete cascade,
  decision text not null default 'included' check (decision in ('included', 'excluded', 'needs_review')),
  exclusion_reason text,
  notes text check (notes is null or char_length(notes) <= 2000),
  reviewed_by uuid references auth.users (id) on delete set null,
  reviewed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint research_submission_reviews_exclusion_reason check (
    (decision = 'excluded' and char_length(btrim(coalesce(exclusion_reason, ''))) > 0)
    or (decision <> 'excluded' and exclusion_reason is null)
  )
);

create index research_submission_reviews_decision_idx
  on public.research_submission_reviews (decision, reviewed_at desc);

alter table public.research_submission_reviews enable row level security;

-- Reviews are only available through the allowlisted research-admin Edge Function.
revoke all on table public.research_submission_reviews from anon, authenticated;
grant select, insert, update, delete on table public.research_submission_reviews to service_role;
