# FACE assessment data layer

## Supabase setup

1. Create or select the Supabase project.
2. In **Authentication → Providers → Anonymous**, enable anonymous sign-ins.
3. Apply `migrations/202607290001_create_assessment_data_layer.sql` with the
   Supabase CLI or the SQL editor.
4. Copy `.env.example` to `.env.local` and set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

The anon key is designed for browser use. Access control is enforced by Row
Level Security and by the authenticated anonymous user's `auth.uid()`. Never
put the Supabase service-role key in a `VITE_` environment variable.

## Current assessment version

The current repository contains 20 baseline questions, so the app records
`face-baseline-20q-v1`. The persistence code uses the question array length and
does not hard-code 20 or 40; a future 40-question version must receive a new
version string.

## Verification

1. Run `npx tsc --noEmit`.
2. Run `npm run build`.
3. Complete the baseline assessment in a local environment configured with
   Supabase.
4. Confirm one completed row in `assessment_runs` and exactly `question_count`
   related rows in `assessment_answers`.
5. Confirm a second browser profile cannot select the first profile's run or
   answers.
6. Temporarily use an invalid Supabase URL and confirm the last question shows
   a retry message instead of navigating to the result.
