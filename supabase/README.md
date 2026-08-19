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

The current repository contains 24 baseline questions, so the app records
`face-baseline-24q-v3.0-two-stage`. The persistence code uses the current
question count and a distinct version string, while completed 20- and
40-question runs remain readable as historical data.

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

## FACE V2.5 member and commerce data

Apply `migrations/202608190001_face_v25_data_and_commerce.sql` after the earlier
migrations. V2.5 keeps the following sources of truth:

- Supabase Auth: current login identity and provider session.
- `member_activity_events`: sign-in, sign-out, and restored-session history.
- `assessment_runs` + `assessment_answers`: versioned 24-question FACE result
  and raw answers. Older 20/40-question runs remain historical records.
- `awareness_diary_entries`: eight raw FACE Daily answers plus a separately
  stored structured/generated result, model version, animal code, and date.
- `content_reading_progress`: anonymous public reading and member-only reading,
  including sessions, maximum progress, and completion.
- `payment_orders`: server-only ECPay orders and verified callback payloads.
- `member_entitlements`: the source of truth for paid access. Do not duplicate
  this as an editable `is_paid` flag in member metadata.

New V2.5 tables use explicit Data API grants together with RLS. Payment and
reading writes that affect commercial or analytics truth are server-only and
require `SUPABASE_SERVICE_ROLE_KEY`; never expose that key to Vite/browser code.
