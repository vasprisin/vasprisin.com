# SEO + Mobile UI Audit & Implementation — Plan

## Scope
Full SEO + mobile UI audit and fixes across home, /blog, /blog/[slug], /publications.

## Checklist

### 1. SEO audit (read-only findings)
- [x] Inspect heads of every page
- [x] Check heading hierarchy, alt text, internal linking, canonicals, OG/Twitter
- [x] Write findings to `tasks/seo-audit.md`

### 2. SEO implementation
- [x] Improve `BlogLayout.astro` head: og:url, og:site_name, twitter:title/description/image, RSS link, apple-touch-icon (if present), JSON-LD slot
- [x] Improve `index.astro` head: complete OG, Twitter, canonical, Person JSON-LD
- [x] Add Blog JSON-LD to `/blog`
- [x] Add BlogPosting + BreadcrumbList JSON-LD to `/blog/[...slug]`
- [x] Add CollectionPage + BreadcrumbList JSON-LD to `/publications`
- [x] Add ogImage props where useful; verify alt text quality on `<img>`
- [x] Audit `/publications` h2 vs h1 (already h1 — verify)
- [x] Fix `/#contact` etc; ensure footer/header links work cross-page (currently `#about` relative-only on index — wait, index uses `#about`, BlogLayout uses `/#about` — good)
- [x] On index.astro, header anchor links use `#about` etc which break from /blog — but index has its own header. BlogLayout header uses `/#about` correctly.

### 3. Static SEO assets in `public/`
- [x] `public/robots.txt`
- [x] Install `@astrojs/sitemap`, configure `astro.config.mjs` with `site`
- [x] `public/llms.txt`
- [x] `public/llms-full.txt`

### 4. RSS feed
- [x] Install `@astrojs/rss`
- [x] Create `src/pages/rss.xml.js`

### 5. Mobile UI audit + fixes
- [x] Audit at 375/768/1280
- [x] Tap targets, no horizontal scroll, form usability, drawer
- [x] Write findings + changes to `tasks/mobile-audit.md`

### 6. Performance pass
- [x] img width/height where applicable, lazy loading

### 7. Accessibility quick pass
- [x] Focus states, ARIA labels, color contrast notes

### 8. Verification
- [x] `npx astro build` — zero errors
- [x] curl every relevant route → 200
- [x] Spot-check rendered HTML for meta + JSON-LD

### 9. Final report

**Completed 2026-05-21.**

#### Files changed
- `astro.config.mjs` — added `site: 'https://vasprisin.com'` and `@astrojs/sitemap` integration.
- `package.json` (+ lock) — added `@astrojs/rss`, `@astrojs/sitemap`.
- `src/layouts/BlogLayout.astro` — extended head: canonical (absolute), full OG (incl. `og:url`, `og:site_name`, `og:image:alt`, `og:locale`), full Twitter Card, article:* meta (for posts), `author`, `theme-color`, RSS+sitemap `<link>`s, and optional `jsonLd` slot. New props: `ogType`, `articleMeta`, `jsonLd`.
- `src/pages/index.astro` — full OG/Twitter, canonical, Person + WebSite JSON-LD, RSS+sitemap links. Hero `<img>` now has explicit width/height + `fetchpriority="high"`. About `<img>` got `loading="lazy"`. Fixed broken Arksend `href="#"` → `https://arksend.com`. Improved hero alt text.
- `src/pages/blog/index.astro` — Blog schema JSON-LD with all posts, `ogType=website`.
- `src/pages/blog/[...slug].astro` — BlogPosting + BreadcrumbList JSON-LD, `ogType=article`, article:* meta with tags + author + publishedTime, optional cover image.
- `src/pages/publications.astro` — CollectionPage + BreadcrumbList JSON-LD with each publication as CreativeWork.
- `src/pages/rss.xml.js` — new, emits RSS feed of non-draft posts.
- `public/robots.txt` — new, allows all + AI crawlers explicit allow-list (configurable), disallows `/admin/` + `/uploads/`, points to sitemap.
- `public/llms.txt` — new, llmstxt.org-compliant.
- `public/llms-full.txt` — new, full blog post bodies inlined.
- `public/site.css` — appended a11y + mobile polish block (`:focus-visible`, 44×44 touch targets on mobile/coarse-pointer, no horizontal scroll, iOS no-zoom inputs, form overflow safety).
- `tasks/seo-audit.md` + `tasks/mobile-audit.md` — written.

#### Not done / flagged for manual follow-up
- `apple-touch-icon.png` is not present in `public/`. Did not fabricate one. Add a 180×180 PNG and a `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` to both heads when ready.
- Home page (`index.astro`) has a footer link `href="gallery.html"` (line ~439) pointing to a non-existent page. Left untouched (out of scope).
- `/publications` page contains placeholder data (e.g., "Sample published paper title one") — the user knows; needs replacing with real publications.
- The home `<img src="/assets/priyanshu-portrait.png">` does not have a `width`/`height` matching the actual source dimensions — used 720×900 as a reasonable aspect (looked at the existing rendering width). User should adjust if portrait file aspect differs significantly.
- A dedicated OG image (1200×630) doesn't exist; both pages currently use the portrait. Consider a branded social card.
- Newsletter form has no backend wired (existing state — out of scope).
- Decap CMS at `/admin` is `noindex,nofollow` already. Now also blocked at robots.txt.

#### Verification
- `npx astro build` → 6 pages built, 0 errors, sitemap-index.xml generated.
- All routes return 200 from dev server (`/`, `/blog`, `/blog/<slug>`, `/publications`, `/robots.txt`, `/llms.txt`, `/llms-full.txt`, `/rss.xml`). `/sitemap-index.xml` only exists in built `dist/` (Astro sitemap integration is build-time only — verified at `dist/sitemap-index.xml` + `dist/sitemap-0.xml`).
- Spot-checked rendered HTML on `/`, `/blog`, `/blog/how-i-think-about-pipeline`, `/publications` — all four show correct meta, canonical, OG/Twitter, and JSON-LD.
