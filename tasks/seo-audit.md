# SEO Audit — vasprisin.com

Date: 2026-05-21

## Page-by-page

### `/` (`src/pages/index.astro`)
- **Title** OK (`Priyanshu Singh — vasprisin`, 30 chars).
- **Meta description** OK (~110 chars).
- **Canonical** MISSING. Should be `https://vasprisin.com/`.
- **Open Graph** MISSING entirely (no og:title, og:description, og:image, og:url, og:type, og:site_name).
- **Twitter card** MISSING.
- **JSON-LD** MISSING. Person schema strongly recommended for a personal brand.
- **Headings:** one `<h1>` ("Priyanshu Singh") + logical h2/h3 hierarchy. OK.
- **Images:** all have `alt`. Hero portrait at index.astro:95 is missing `width`/`height` and is above the fold (correctly NOT lazy). Gallery + client/employee images all have `loading="lazy"`. OK.
- **External `<a target="_blank">`:** all have `rel="noopener"` but missing `rel="noreferrer"` is a minor concern (noopener alone is sufficient for security in modern browsers; noreferrer is preferred but optional). Skip.
- **Arksend link** (index.astro:300) is `href="#"` instead of the real domain.
- **`apple-touch-icon`** MISSING from public/ — flag, don't fabricate.
- **`<link rel="alternate" type="application/rss+xml">`** MISSING (will add once RSS exists).

### `/blog` (`src/pages/blog/index.astro` + `BlogLayout.astro`)
- **Title** OK (`Blog — Priyanshu Singh`).
- **Description** OK.
- **Canonical** present and correct.
- **OG:** partial. `og:title`, `og:description`, `og:image`, `og:type=article` present. MISSING: `og:url`, `og:site_name`, `og:image:alt`. `og:type=article` is wrong for the blog index (should be `website`).
- **Twitter card:** `twitter:card` only; MISSING `twitter:title`, `twitter:description`, `twitter:image`.
- **JSON-LD** MISSING. Blog schema recommended.
- **Headings:** one `<h1>` ("Notes on capital, pipeline, and operating.") + h2 cards. OK.
- **Images:** none.

### `/blog/<slug>` (`src/pages/blog/[...slug].astro` + `BlogLayout.astro`)
- **Title** OK (post title + Priyanshu Singh).
- **Description** OK (uses post description).
- **Canonical** correct.
- **OG/Twitter:** inherits the same partial layout. Needs `og:url`, `og:site_name`, `article:published_time`, `article:author`, `article:tag`, full twitter:* fields.
- **JSON-LD** MISSING. `BlogPosting` + `BreadcrumbList` recommended.
- **Headings:** one `<h1>` per post + h2/h3 from markdown. OK assuming posts don't include another h1 (verified: they start with prose, no h1 in MD).
- **Internal linking:** good (sidebar index + prev/next).

### `/publications` (`src/pages/publications.astro` + `BlogLayout.astro`)
- **Title** OK.
- **Description** OK.
- **Canonical** correct.
- **OG/Twitter:** same partial as above.
- **JSON-LD** MISSING. `CollectionPage` + `BreadcrumbList`.
- **Headings:** one `<h1>` + h2 per pub card. OK.
- **Coming-soon items** use `<a href="#slug">` which is fine but `<span aria-disabled="true">` on the read CTA — OK.

## Static assets / discoverability
- `public/robots.txt` MISSING.
- `public/sitemap.xml` MISSING. `@astrojs/sitemap` integration NOT installed.
- `public/llms.txt` MISSING.
- `public/llms-full.txt` MISSING.
- No RSS feed.
- `astro.config.mjs` MISSING `site:` field — required for sitemap + RSS to emit absolute URLs.

## Cross-cutting
- `index.astro` header anchors use `#about`, `#companies`, etc. — fine because the only place that header appears is the home page (BlogLayout has its own header that correctly uses `/#about`).
- Footer link in index.astro `<a href="gallery.html">` (index.astro:439) — broken, points at a non-existent file. Flag for user. (Not in scope to fabricate a gallery page.)
