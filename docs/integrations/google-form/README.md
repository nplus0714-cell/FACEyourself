# Google Form → Supabase research pilot

`Code.gs` creates the private pilot form, its response spreadsheet, and the
installable form-submit trigger. The form is text-only and deliberately does
not mention FACE, the animal result, or the scoring hypothesis. Scenario items
show the complete A/B actions before the response scale so each answer remains
understandable without an image.

The V2.5 pilot mirrors the production 24-question bank: eight text-only
versions of the visual comparisons and sixteen two-stage scenarios. It also
includes eight unscored calibration/feedback items plus five unscored market
research items. None of those thirteen research items may change the FACE
score or animal result.

## Data flow

1. Google Form stores the restricted original response in its linked Google
   Sheet. If an email is supplied, it is present in that raw response row; the
   form copy must not claim the source sheet is anonymous.
2. The installable trigger maps the 24 answers to stable `face-v2-XX` codes and
   labels the instrument as `google-form-text-only`.
3. The trigger calls the `research-form-webhook` Supabase Edge Function using
   the private `WEBHOOK_SECRET` script property.
4. The Edge Function independently calculates the scores and stores the email,
   separate result/marketing consents, submission and answers in protected
   research tables. Research analysis uses participant IDs rather than email.

The previous 40-question submissions remain under
`face-baseline-40q-v2.1-two-stage`. Do not rewrite or merge those historical
rows into the 24-question version.

The webhook secret must never be placed in the Google Sheet or browser code.
