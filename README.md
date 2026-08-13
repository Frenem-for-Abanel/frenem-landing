# Frenem marketing site

Marketing site for [Frenem](https://frenem.com), an organisation clarity suite from Bangalore, India:

- **Pulse** (`/pulse`): relational diagnostics. A four-week pilot that maps how people actually work together (exit risk, hidden brokers, cross-team friction).
- **Build** (`/build`): an 8-week organisation-design sprint covering decision rights, job architecture, governance, and succession.
- **Prism** (`/prism`): lightweight employee management with live org charts, KRAs, review cycles, and audit trails.

## Stack

Next.js 15 (App Router, static marketing routes), React 19, Tailwind CSS v4 (tokens in `app/globals.css` via `@theme`), framer-motion, react-hook-form + zod, nodemailer, vitest.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run test     # vitest unit tests (app/**/*.test.ts)
npm run lint     # eslint
npm run build    # production build
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `EMAIL_USER` | GoDaddy SMTP username used to send contact notifications. Unset locally → submissions are logged to the server console instead of emailed. |
| `EMAIL_PASSWORD` | GoDaddy SMTP password. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap, and JSON-LD (defaults to `https://frenem.com`). |

## Project structure

```
app/
  page.tsx              Homepage (umbrella positioning + product router)
  pulse|build|prism/    Product pages, each with metadata + OG image
  api/contact/          Contact endpoint (validation, honeypot, rate limit, SMTP)
  components/           Shared sections and primitives
    build|pulse|prism/  Page-specific sections and product visuals
    contact/            Modal shell + the five contact flows
  context/              Contact-modal provider
  utils/                Pure logic (validation, questionnaires, emails) + tests
```

### Design system

Colour, font, and layout tokens live in `app/globals.css` (`@theme`). Each page sets a signature tint via a `.tint-*` wrapper class; components read `--tint-ink` / `--tint-bright` / `--tint-soft` so the same section adapts per product. Display type is Fraunces, UI type is Inter, and the wordmark is League Spartan (all via `next/font`).

### Contact flows

One modal, five flows: Build assessment questionnaire, Build quick contact, Pulse questionnaire, Pulse quick contact, and a general form. Deep links: `/pulse?intent=read`, `/build?intent=assessment`, `?intent=contact` on any page. Submissions post to `/api/contact` and are emailed to the team (recipients configured in `app/api/contact/route.ts`).
