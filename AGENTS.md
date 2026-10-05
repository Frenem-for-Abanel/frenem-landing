# AGENTS.md

## Cursor Cloud specific instructions

This is the **Frenem marketing site** — a Next.js 15 (App Router) static marketing site with a
contact API. See `README.md` for the product overview, project structure, and env vars. There is a
single service (the Next.js app); no database or external services are required for development.

### Running / testing / building

Standard scripts are defined in `package.json`:

- `npm run dev` — dev server with Turbopack on http://localhost:3000
- `npm run lint` — ESLint (`next lint`)
- `npm run test` — vitest unit tests (`app/**/*.test.ts`, `lib/**/*.test.ts`)
- `npm run build` — production build

Dependencies are installed by the startup update script (`npm ci`), so you normally don't need to
reinstall.

### Non-obvious notes

- **Contact form works without SMTP creds.** `EMAIL_USER` / `EMAIL_PASSWORD` are unset by default.
  In that case `/api/contact` uses nodemailer's `jsonTransport` and logs the rendered email to the
  dev server console (search the dev log for `[contact] SMTP not configured`) instead of sending —
  submissions still return HTTP 200. This makes the contact flow fully testable locally with no
  secrets. The "loud failure on missing SMTP" branch only triggers when `NODE_ENV=production`.
- `next lint` prints a deprecation warning (removed in Next 16) but still runs and passes; this is
  expected, not an error.
