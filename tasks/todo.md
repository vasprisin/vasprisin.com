# Blog + Newsletter — Plan

## Scope

1. **Blog home page** at `/blog`
2. **Individual blog post pages** at `/blog/<slug>`
3. **Left-sidebar post index** on both pages
4. **Newsletter section** on the home page (UI only)
5. **Exit-intent newsletter popup** site-wide (UI only)
6. Author is always **Priyanshu Singh**

## Constraints

- Reuse the existing **vp-** design system (no new tokens, no new fonts, no Tailwind).
- Astro 6 native — use **Content Collections** for posts (markdown in `src/content/blog/`).
- No third-party dependencies added.
- CSS additions are **append-only** to `public/site.css`. No edits to existing rules.
- No backend yet — newsletter forms log a thank-you state on submit.

## Files to create

- `src/content.config.ts` — collection schema
- `src/content/blog/<slug>.md` × 3 — seed posts
- `src/layouts/BlogLayout.astro` — shared header/footer/drawer + popup
- `src/pages/blog/index.astro` — blog home
- `src/pages/blog/[...slug].astro` — individual post

## Files to modify

- `src/pages/index.astro` — add nav link to `/blog`, add `Subscribe` section, embed exit-intent popup
- `public/site.css` — append blog + newsletter + popup styles

## Blog management recommendation

- **Now:** Markdown files in `src/content/blog/`. Claude Code (or Priyanshu) can write/edit posts directly. Commit + push = published.
- **Later (optional):** Layer **Keystatic** on top for a visual editor that still writes plain markdown back to the same files. Free, OSS, no lock-in.

## Verification checklist

- [ ] `/` still renders (regression check)
- [ ] `/blog` renders with sidebar + post cards
- [ ] `/blog/<slug>` renders an article with sidebar
- [ ] Mobile: sidebar collapses; popup respects touch
- [ ] Popup fires once per session
- [ ] No console errors
- [ ] Build passes

## Review

**Completed 2026-05-20.**

- Astro content collection set up at `src/content.config.ts` with schema (title, description, date, author defaulting to "Priyanshu Singh", tags, cover, draft).
- 3 seed posts written in markdown under `src/content/blog/`.
- `src/layouts/BlogLayout.astro` shares the header/footer/drawer/popup with the home page.
- `/blog` renders a left-sidebar index + main post feed with cards.
- `/blog/<slug>` renders the article with a left-sidebar index (current post highlighted), byline, prose, an inline newsletter pitch, and prev/next nav.
- Home page got a `Writing` link in the header, drawer, and footer; a small newsletter section before Contact; and the exit-intent popup markup + script.
- Exit-intent popup fires on `mouseout` past the top of viewport (desktop) or after 45s + 50% scroll depth (touch). Shown once per session via `sessionStorage`.
- `public/site.css` appended, not edited.
- `astro build` passes; all 5 pages generated (1 home + 1 blog index + 3 posts).
- Local smoke-test: every route returns 200 and contains the expected markers (3 sidebar items, 3 cards, popup + newsletter card present on home).

**Next options (not done):**
- Wire newsletter form to a real provider (ConvertKit, Buttondown, Resend, Loops).
- Layer **Keystatic** on top for a visual editor that writes to the same markdown files.
- Add RSS feed (`@astrojs/rss`).
