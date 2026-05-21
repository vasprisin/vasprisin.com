# Handoff — pending tasks

Last updated: 2026-05-21

## Top priority

### 1. Decap CMS auth (no login yet)
Decap admin is wired at `/admin/` but has no auth on Railway. Pick one and tell me to wire it.

- **A. Netlify deploy (recommended)** — deploy static site to Netlify (free, ~5 min), enable Identity + Git Gateway, invite priyanshu@dolta.io. Gives real email/password login. Can run alongside Railway or replace it.
- **B. GitHub OAuth on Railway** — adds a tiny OAuth proxy as a 2nd Railway service. Login is "Sign in with GitHub", not email/password.
- **C. Self-hosted GoTrue on Railway** — real email/password, but requires Postgres + transactional email provider (Mailgun/SendGrid). 1–2 hours of setup.
- **D. Switch to Sveltia CMS** — Decap fork, accepts a GitHub PAT directly, no server/proxy needed. Single-user. Fastest production path on Railway.

Full setup steps for each mode already drafted in `tasks/decap-setup.md`.

### 2. Logo — needs proper file(s)
Reverted to text wordmark in header + mobile drawer for now. The previous PNG was square with a white background — wrong shape for a header (sits next to nav links) and wrong colour for the dark footer.

**Send these files** and I'll wire them in one go:

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

The unused `public/logo.png` from the previous attempt is sitting there — I'll delete it when you send replacements.

## Medium

### 3. Broken footer link
`src/pages/index.astro:439` — footer has `href="gallery.html"` which 404s. Either remove the link or create the page. SEO agent left it alone (out of scope).

### 4. Newsletter forms not wired
Both the inline newsletter form and the exit-intent popup currently just say "thanks" client-side. Pick a provider (Mailchimp / ConvertKit / Buttondown / Substack-as-backend) and I'll wire it up.

### 5. Replace publication placeholder data
`src/pages/publications.astro:16-80` has 6 sample entries (first 3 "Coming soon", last 3 are sample journal placeholders). Replace with real papers when you have them. The data array is plain TS — easy to edit.

### 6. Dedicated OG social card
Currently OG/Twitter cards use `/assets/priyanshu-portrait.png` (portrait aspect). For best Twitter/LinkedIn rendering, supply a **1200×630** horizontal card (your name, headline, branding). Drop at `public/og-card.png` and I'll wire it as the default `ogImage` in `BlogLayout.astro`.

## Low / nice-to-have

### 7. Publications as a Content Collection
Currently `/publications` is a hardcoded TS array — Decap can't edit it. To make publications editable via CMS:
1. Create `src/content/publications/*.md` files (one per publication, frontmatter mirroring the current `Publication` type).
2. Add a `publications` collection to `src/content.config.ts`.
3. Rewrite `src/pages/publications.astro` to `getCollection('publications')`.
4. Add a matching collection block in `public/admin/config.yml`.

### 8. robots.txt — add Decap admin disallow
SEO agent's `public/robots.txt` already disallows `/admin/` and `/uploads/`. ✅ No action needed — already done.

### 9. Real apple-touch-icon at 180×180
Currently using the 256×256 favicon as the apple-touch-icon (iOS scales it). Optional: supply a true 180×180 version for sharper rendering on home-screen pinned shortcuts.

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
- Decap CMS scaffolded at `/admin/` (auth still pending — see above)
