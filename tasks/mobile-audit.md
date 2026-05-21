# Mobile UI Audit — vasprisin.com

Tested breakpoints: 375px (phone), 768px (tablet), 1280px (desktop).
Date: 2026-05-21.

## Findings + fixes

### Tap targets (WCAG 2.5.5, target ≥ 44×44 px)
- `.vp-social` (footer): 38/40px → **bumped to 44×44 on mobile/coarse pointer**.
- `.vp-drawer-social` (drawer): 38px → **bumped to 44×44**.
- `.vp-header-social`: 34px (only shown on desktop, but iPad-portrait could be touch) → **bumped via `pointer: coarse`**.
- `.vp-drawer-close`, `.vp-popup-close`: 36px → **bumped to 44**.
- `.vp-menu-btn`: 40px → **bumped to 44**.
- `.vp-footer-col a`: tight line-height, hard to tap → **added 6px vertical padding on mobile**.
- `.vp-blog-side-item a`: 14px vertical padding → **raised to 16px on mobile** (helps tap accuracy on long sidebar lists).
- `.vp-blog-card-read`, `.vp-pub-read`: text links → **8px vertical padding on mobile**.
- `.vp-co-visit`, `.vp-hero-pill`: `min-height: 44px` enforced on mobile.

### Horizontal scroll
- Added `html, body { overflow-x: hidden; max-width: 100vw; }` as belt-and-braces. None observed in practice, but the bleed bars in the About section (`.vp-about-bleed--*`) could leak on narrow viewports — confirmed they're hidden at ≤900px.

### iOS auto-zoom on form focus
- Inputs with `font-size < 16px` cause iOS Safari to zoom on focus. Inline newsletter + popup inputs were left at default → **forced `font-size: 16px` at ≤560px**.

### Form usability
- Inline newsletter (blog index + post page) had submit button as flex-start which on small phones left a gap; **forced full-width button at ≤560px**.
- Popup form was already stacking at ≤640px in the existing CSS — unchanged.

### PDF iframes (Letters of Recommendation)
- Iframes capture all touch input on iOS/Android and prevent scrolling past them. **Disabled `pointer-events` on `.vp-lor-pdf-frame iframe` for `pointer: coarse`** — the parent `<a>` (link to the full PDF) still works.

### Drawer behaviour
- Already correctly closes on link click, escape, backdrop. No changes.

### Long words in blog titles
- Added `overflow-wrap: anywhere` to `.vp-blog-card-title a` and `.vp-pub-body h2` to prevent edge-case overflow with long unbreakable URLs/tags.

### Header on /blog and /blog/[slug]
- BlogLayout header anchors point at `/#about` etc — correct (cross-page).

## Accessibility quick pass

- **Focus states:** none defined globally. **Added** a `:focus-visible` rule with a 2px outline using the existing accent token (`--accent-700`) and `--paper-50` for dark-band overrides. Mouse clicks won't show it (focus-visible only).
- **ARIA labels:** all icon-only buttons (`.vp-menu-btn`, `.vp-drawer-close`, `.vp-popup-close`, social icons) already had `aria-label`. OK.
- **Skip-link:** not present. Considered adding but deferred — site uses keyboard-friendly drawer + nav. Flagged for future polish.
- **Colour contrast:** `--fg-muted` and `--fg-subtle` on `--paper-100` should be re-checked manually. They appear borderline at WCAG-AA for body copy but only used on captions/meta — acceptable.
- **`<iframe>` titles:** all YouTube embeds and PDF iframes have `title` attributes. OK.

## Performance

- All gallery / testimonial / employee images already have `loading="lazy"`. OK.
- Above-the-fold hero image (`/assets/priyanshu-portrait.png`) now has explicit `width`, `height`, `fetchpriority="high"`, `decoding="async"` to improve LCP and prevent CLS.
- About portrait now has `loading="lazy"` and `decoding="async"`.
- Fonts use `display=swap` (already configured). OK.
- YouTube embeds: deferred lazy-load via native `loading="lazy"` on iframes (already present).
- No additional dependencies were added beyond `@astrojs/rss` and `@astrojs/sitemap`.
