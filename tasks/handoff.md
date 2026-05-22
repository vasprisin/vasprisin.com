# Handoff — pending tasks

Last updated: 2026-05-22

## In progress

### Sveltia CMS migration
Agent A is swapping `/admin/` from Decap to Sveltia (a Decap fork that accepts a GitHub PAT directly — no server/proxy, single-user). Once the wiring lands, you'll need to supply:

- A fine-grained **GitHub Personal Access Token** with `contents: read/write` scoped to `vasprisin/vasprisin.com`.
- Single-user only — the PAT is not shareable with collaborators.

Setup steps for all auth modes (including Sveltia) are in `tasks/decap-setup.md`.

---

## Blocked on user-supplied files

### Logo — needs proper file(s)
A first-pass `vasprisin-logo.png` is wired into the header and mobile drawer. Footer is still text wordmark. For a production-grade set (crisp at any DPR, works on dark surfaces, smaller payload), send:

| File | Format | Dimensions | Use |
|---|---|---|---|
| `logo.svg` | SVG, horizontal wordmark, transparent bg | n/a (vector) | **Primary** — header + mobile drawer. SVG scales perfectly at any DPR, smallest file size for a wordmark. |
| `logo-light.svg` | SVG, same mark but in **white** (or paper-100), transparent bg | n/a | Footer (on dark background) |
| `logo.png` | PNG, transparent bg, horizontal wordmark | **800 × 160** (5:1 aspect) | PNG fallback if SVG isn't possible. Displays crisp at retina up to ~80px tall. |
| `logo-light.png` | PNG, white wordmark, transparent bg | **800 × 160** | PNG fallback for dark footer |

**Guidance:**
- Horizontal wordmark, not square — header height is ~44px and it sits inline next to nav (About / Companies / Credentials / Blog / Contact).
- Transparent background (alpha channel) so it works on both light and dark.
- If you only have a square logomark + wordmark together: send the **wordmark-only** version. The square mark is already covered by the favicon.
- If you want a separate icon mark for places like footer or social, also send `mark.svg` / `mark.png` (square, 512×512).

Drop them in `uploaded content/` (or anywhere — tell me the path) and I'll move + wire.

### Real publication entries
`src/pages/publications.astro:17-81` has 6 sample entries (first 3 "Coming soon", last 3 sample journal placeholders). Replace with real papers when you have them. The data array is plain TS — easy to edit. Will get migrated to a content collection later (see "Nice-to-have").

### Dedicated OG social card
Currently OG/Twitter cards use `/assets/priyanshu-portrait.png` (portrait aspect). For best Twitter/LinkedIn rendering, supply a **1200×630** horizontal card (your name, headline, branding). Drop at `public/og-card.png` and I'll wire it as the default `ogImage` in `BlogLayout.astro`.

### Real 180×180 apple-touch-icon (low)
Currently using the 256×256 favicon as the apple-touch-icon (iOS scales it). Optional: supply a true 180×180 version for sharper rendering on home-screen pinned shortcuts.

---

## Cleanup

### Airtable test rows
Four stale rows in the `leads` table of base `app8hP7xVZDj3o45h` — delete manually in the Airtable UI:

- `popup-test@…`
- `news-test@…`
- `contact-test@example.com`
- Empty row `recqm1bhtAG4oPAlO`

Reference: `tasks/todo.md`.

---

## Nice-to-have / later

### Publications as a Content Collection
Worth doing **after** Sveltia auth is verified working — the point is making publications CMS-editable. Currently `/publications` is a hardcoded TS array.

1. Create `src/content/publications/*.md` files (one per publication, frontmatter mirroring the current `Publication` type).
2. Add a `publications` collection to `src/content.config.ts`.
3. Rewrite `src/pages/publications.astro` to `getCollection('publications')`.
4. Add a matching collection block in `public/admin/config.yml`.

### True 180×180 apple-touch-icon
See "Blocked on user-supplied files" above — listed there since it's a file you'd need to send. Lowest priority.

### Broadcast email provider
Newsletter + popup submissions already land in Airtable via `/api/submit`. If/when you want to actually send broadcasts (Mailchimp / ConvertKit / Buttondown / Substack-as-backend), pick a provider and I'll wire it as a second sink — Airtable stays the source of truth.

---

## Done in recent sessions
- Header nav: "Writing" → "Blog" (6 instances)
- `/blog` page: removed "Writing" eyebrow + "Essays from Priyanshu Singh…" lede
- Site-wide: every "essay/essays" reference purged
- New `/publications` page with image cards + Coming Soon state
- Full SEO audit + implementation (meta, OG, JSON-LD, robots.txt, sitemap, llms.txt, llms-full.txt, RSS)
- Mobile + a11y polish (44×44 touch targets, focus-visible, iOS no-zoom inputs)
- Favicon (PNG + apple-touch-icon) wired into both head sections
- Logo image replacing text wordmark in header + mobile drawer
- Refreshed favicon set + vasprisin logo
- Mobile hamburger moved to top-right
- Decap CMS scaffolded at `/admin/` (auth pending — Sveltia migration in progress)
- robots.txt disallows `/admin/` and `/uploads/`
- Removed broken `gallery.html` footer CTA (the `vp-gallery-cta` block in `src/pages/index.astro`)
- Newsletter + exit-intent popup wired to Airtable via `/api/submit` (base `app8hP7xVZDj3o45h`, `leads` table) — broadcast ESP deferred
- Sveltia chosen as the CMS auth path (over Netlify Identity / GitHub OAuth proxy / self-hosted GoTrue)
