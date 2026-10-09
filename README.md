# Frenem marketing site

Marketing site for [Frenem](https://www.frenem.com), an organisation clarity suite from Bangalore, India:

- **Pulse** (`/pulse`): relational diagnostics. A pilot that maps how people actually work together (exit risk, hidden brokers, cross-team friction).
- **Build** (`/build`): organisation design covering decision rights, job architecture, governance, and succession. Taken whole, or only the parts picked in the on-page planner.
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
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap, and JSON-LD (defaults to `https://www.frenem.com`). An apex value such as `https://frenem.com` is rewritten to www, so sitemap and canonicals cannot advertise URLs that 404 behind GoDaddy forwarding. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional. Google Search Console verification token (the `content` of its meta tag). |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Optional. Bing Webmaster Tools verification token (`msvalidate.01`). |

## Canonical host

The live app is **`www.frenem.com`** (Railway custom domain). Sitemap, robots, canonicals, Open Graph, and JSON-LD use that origin.

Apex → www redirects live in `middleware.ts` and `next.config.ts` (308, path and query preserved, host-gated on `frenem.com`). They only take effect once `frenem.com` DNS points at this Railway service. GoDaddy domain forwarding (A records `15.197.225.128` / `3.33.251.168`) currently intercepts the apex host: `/` 301s to www, but every other path, including `/sitemap.xml`, 404s. To finish the cutover, disable GoDaddy forwarding, add `frenem.com` as a Railway custom domain, and point the apex with ALIAS/ANAME or CNAME flattening at Railway (GoDaddy's root CNAME support is limited; Cloudflare flattening is the usual workaround). Then `curl -sI -X GET https://frenem.com/pulse` should 308 to `https://www.frenem.com/pulse`.

## Project structure

```
middleware.ts             Host-gated 308 from frenem.com to www.frenem.com
app/
  page.tsx              Homepage (umbrella positioning + product router)
  pulse|build|prism/    Product pages, each with metadata + OG image
  engineering/          Essays and log (MDX in content/), RSS feed, OG images
  not-found.tsx         Unknown URLs: noindex, with links back into the site
  sitemap.ts robots.ts  Crawl files; manifest.ts, icon*, llms.txt/ alongside
  api/contact/          Contact endpoint (validation, honeypot, rate limit, SMTP)
  components/           Shared sections and primitives
    build|pulse|prism/  Page-specific sections and product visuals
    contact/            Modal shell + the six contact flows
  context/              Contact-modal provider
  utils/                Pure logic (validation, questionnaires, emails) + tests
```

### Design system

Tokens live in `app/globals.css` (`@theme`). The palette is muted pastels, each with a mid tone for shapes and a deep partner for dark bands: sand and ink for the suite, sage and forest for Pulse, clay and oxblood for Build, heather and indigo for Prism (plus mist and rose as supporting tones). Pages set theirs through a `.tint-*` wrapper (`--tint-soft`, `--tint-bright`, `--tint-deep`, `--tint-ink`). `app/utils/palette.ts` mirrors the values for canvas and SVG fills that animate.

Type is one variable grotesk, Archivo, with the `wdth` axis loaded: headlines are heavy and wide, and emphasis (`<em>`) drops to a hairline weight rather than italics or colour. The wordmark is League Spartan; the Engineering section keeps IBM Plex Mono for its ledger.

Sections separate by colour field, not rules, with a fine print grain (`.grain`) over coloured fields. Circles and pills are reserved for shapes and buttons; panels and tiles are square.

### Motion

- `components/motion/HeroScene.tsx` and `utils/scenes.ts`: every hero is one dot-matrix field on the page's own colour. A fine lattice runs edge to edge behind the copy and the scene; each page's scene (suite: diagnose, design, operate; Build: today and after; Pulse: a survey and Pulse; Prism: scattered files and one live chart) grows out of the same lattice, regroups between states, wakes under the pointer, and scatters once it has scrolled past. One canvas, paused off screen, a still frame under reduced motion.
- `components/motion/ModuleField.tsx`: the smaller dot-matrix marks on the home product cards.
- `components/motion/Blocks.tsx` and `utils/blocks.ts`: every figure is a fixed cast of rectangles that springs (`MorphField`, with an optional idle drift and label overlays) or scroll-scrubs (`ScrubField`) between layouts defined in `utils/compositions.ts`. Attributes are written straight to the DOM, so there are no per-frame React renders.
- `FieldBackdrop`: coloured sections grow in as a circle from a corner as they arrive.
- `SplitText` (words rising out of their line box), `Reveal` (rise, scale, or clip wipe), `Parallax`, a kinetic `Marquee` (scroll velocity drives speed, width axis, and lean), and a footer wordmark whose weight follows the scroll.
- Primary buttons have a magnetic pull for mouse users.
- Pinned sequences (home product cards, the "How it works" stage) only pin at `md`/`lg` and up; phones get plain stacked layouts.
- Every effect respects `prefers-reduced-motion`, and content is visible without JS: reveals only hide what JS has confirmed is below the fold.

### Build planner

`app/utils/build-plan.ts` is the single source for the six founder problems, their outcomes, and the modules each resolves to (with dependencies). The page shows only problems, outcomes, and a scope label (focused, broader, complete); modules and dependencies are internal and go to the team in the plan email. Timelines are deliberately not shown. The plan sheet is sticky only where it fits whole under the header (the `lg-tall` variant in `globals.css`: 1024px wide and 900px tall); everywhere else a floating bar keeps the plan and its call to action in reach.

### SEO

- Metadata: every page builds its tags with `pageMetadata()` in `app/utils/seo.ts` (absolute title, description, canonical, full Open Graph and Twitter card). Next replaces a nested `openGraph` object instead of merging it with the layout's, so pages should never set it by hand. Every page has its own share image (`opengraph-image.tsx`), essays included; the Twitter card points at that same image. The canonical origin is `https://www.frenem.com` (`app/utils/site.ts`). Unknown URLs render `app/not-found.tsx` (noindex, with links back to the real pages).
- Structured data: `app/utils/structured-data.ts` builds one linked schema.org graph (Organization and WebSite by `@id`, then per page a WebPage, the Service or SoftwareApplication, breadcrumbs, FAQPage, Blog, and BlogPosting), rendered by `components/JsonLd.tsx`. FAQ markup mirrors the visible FAQ exactly; never add answers that aren't on the page.
- Discovery: `sitemap.xml` (real dates only: essays carry theirs, marketing pages omit `lastmod`), `robots.txt` (open to all crawlers, including AI answer engines; only `/api/` is closed), an RSS feed at `/engineering/feed.xml`, and `/llms.txt`, a plain-text map of the site for AI assistants. Update `app/llms.txt/route.ts` when product positioning changes.
- Core Web Vitals: headlines fall back to Arial or Roboto resized to Archivo's wide ExtraBold (`@font-face` blocks at the top of `globals.css`), so text wraps the same before and after the web font loads. The emphasis animation paints its heft with a text stroke instead of animating `font-weight`, which would re-wrap the line mid-animation. Fades start at 1% opacity so Chrome times the hero's Largest Contentful Paint when it appears. Keep all three when changing type or motion; target is CLS under 0.1 and LCP under 2.5s on mobile.

### Contact flows

One modal, six flows: Build assessment questionnaire, Build quick contact, Build plan (sent from the planner), Pulse questionnaire, Pulse quick contact, and a general form. Deep links: `/pulse?intent=read`, `/build?intent=assessment`, `?intent=contact` on any page. Submissions post to `/api/contact` and are emailed to the team (recipients configured in `app/api/contact/route.ts`).
