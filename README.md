<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy the FACE app

This contains everything you need to run your app locally.

For Claude Code project context, architecture, routes, personality data sources,
and editing rules, read [`CLAUDE.md`](CLAUDE.md) first.

View your app in AI Studio: https://ai.studio/apps/drive/1lNvVNAeiOHmtBo-ZyFNf4gsdtUIS7PGl

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and configure Supabase as needed.
3. For Gemini features, set the server-only `GEMINI_API_KEY`. Never prefix it
   with `VITE_`.
4. Run the frontend:
   `npm run dev`

The Vite development server does not execute Vercel Functions. Use Vercel's
local development environment to test `/api/gemini/*` end to end. See
[`api/README.md`](api/README.md).
