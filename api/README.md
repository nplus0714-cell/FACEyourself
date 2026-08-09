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

## ECPay payments

The paid plan uses ECPay's hosted All-in-One checkout. In stage mode it uses
ECPay's published stage merchant automatically. Apply the payment migration,
then configure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` so orders and
verified callbacks can be stored.

When testing through a public tunnel or preview domain, set
`ECPAY_PUBLIC_ORIGIN` to that HTTPS origin so ECPay can reach the callback URLs.

For production, set `ECPAY_ENV=production` and configure `ECPAY_MERCHANT_ID`,
`ECPAY_HASH_KEY`, and `ECPAY_HASH_IV` with the values from the ECPay merchant
console. These values must remain server-only and must never use a `VITE_`
prefix.

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
