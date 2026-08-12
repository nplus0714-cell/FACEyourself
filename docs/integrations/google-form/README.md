# Google Form → Supabase research pilot

`Code.gs` creates the private pilot form, its response spreadsheet, and the
installable form-submit trigger. The form deliberately does not mention FACE,
the animal result, or the scoring hypothesis.

## Data flow

1. Google Form stores the original response in its linked Google Sheet.
2. The installable trigger maps the 40 answers to stable `face-v2-XX` codes.
3. The trigger calls the `research-form-webhook` Supabase Edge Function using
   the private `WEBHOOK_SECRET` script property.
4. The Edge Function independently calculates the scores and stores the email,
   consents, submission and answers in protected research tables.

The webhook secret must never be placed in the Google Sheet or browser code.
