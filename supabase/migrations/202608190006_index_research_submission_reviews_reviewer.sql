create index if not exists research_submission_reviews_reviewed_by_idx
  on public.research_submission_reviews (reviewed_by)
  where reviewed_by is not null;
