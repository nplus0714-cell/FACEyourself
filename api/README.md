# Gemini server API

The browser calls these same-origin Vercel Functions:

- `POST /api/gemini/bar`
- `POST /api/gemini/market-questions`
- `POST /api/gemini/report`

Only the functions read `GEMINI_API_KEY`. Never use a `VITE_` prefix for this
key, because Vite exposes referenced `VITE_` variables to browser code.

## Environment variables

Required:

- `GEMINI_API_KEY`

Optional:

- `GEMINI_TEXT_MODEL` (default: `gemini-3.6-flash`)
- `GEMINI_SEARCH_MODEL` (default: `gemini-3.6-flash`)
- `APP_ORIGIN` (an additional allowed browser origin)

After removing a key from frontend code, rotate the old Gemini key in Google AI
Studio and replace it in Vercel. Removing the reference does not revoke an
already exposed credential.

## Local development

`vite` serves only the frontend. Use Vercel's local development environment
when testing the `/api` routes end to end, with the environment variables set
locally. A plain `npm run dev` preview is still suitable for visual-only work,
but AI calls will not be handled by Vite.

## Rate-limit scope

The included rate limiter is intentionally dependency-free and provides
best-effort protection within each warm Function instance. It is not a global
quota. Before paid traffic or a public campaign, configure a durable shared
rate limit (for example Vercel Firewall or a shared datastore) and add bot
protection.
