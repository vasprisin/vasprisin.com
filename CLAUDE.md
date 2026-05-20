# CLAUDE.md

> Default Agent Instructions — Website Design & Development
> 

---

## HARDCODED RULES — NEVER VIOLATE

### Git

- **NEVER run `git commit`, `git push`, `git add`, or any git write command.**
- Read-only git commands only: `git status`, `git log`, `git diff`.
- If asked to commit: refuse and direct the user to their Git UI or own terminal.
- Suggest commit messages using Conventional Commits: `type(scope): description`
    - Types: `feat`, `fix`, `style`, `refactor`, `content`, `chore`, `docs`, `perf`

### Secrets

- **NEVER hardcode secrets, API keys, tokens, or service URLs** in any file.
- Always use environment variables: `process.env.VAR_NAME` or `import.meta.env.VAR_NAME`.
- Before writing any file: verify it contains zero hardcoded credentials.
- Reference env var names in docs, never actual values.

### Assets & Media

- Never delete or overwrite original source assets without explicit instruction.
- Always preserve originals — write to a new file or path if transformation is needed.

---

## MCP AWARENESS

Before starting any task, ask: **"Is there an MCP that handles this better?"**

Always look for and suggest relevant MCPs when:

- Reading/writing files or repos → GitHub MCP, filesystem MCP
- Fetching live content or data → web fetch / web search MCP
- CMS or content operations → CMS-specific MCP if available
- Any third-party API integration with a known MCP available

Surface the MCP option before writing a manual integration. Let the user decide.

---

## TASK EXECUTION PROTOCOL

### 1. Plan First

- Any task with 3+ steps or a layout/architecture decision: write the plan to `tasks/todo.md` before touching any file.
- Check in with the user if scope is ambiguous before starting.
- If something goes sideways mid-task: **STOP. Re-plan. Don't push forward blindly.**

### 2. One Sub-Task at a Time

- Never parallelize dependent work.
- Complete and verify each sub-task before moving to the next.
- Mark items complete in `tasks/todo.md` as you go.

### 3. Verify After Every Sub-Task

- Check the output renders correctly (no broken layout, missing assets, console errors).
- Check for side effects — did any other page or component break?
- Never assume something looks right. Verify it.
- If you can't verify visually: state clearly what needs manual review.

### 4. Final Sanity Check

- Review the full page or flow end-to-end before marking anything done.
- Check: desktop, mobile breakpoints, and any interactive states.
- Ask: "Would a senior designer and a senior engineer both approve this?"

### 5. Self-Improvement Loop

- After any correction from the user: update `tasks/lessons.md` with the pattern.
- Write a rule that prevents the same mistake from recurring.
- Review `tasks/lessons.md` at the start of each new session.

---

## CODE & DESIGN CHANGE SAFETY

1. **Read before changing.** Understand the existing markup, styles, and component structure before modifying.
2. **Don't break what works.** Navigation, responsive layouts, and existing animations are fragile — treat them that way.
3. **Revert if broken.** If a change breaks the layout or functionality, undo immediately before attempting a fix.
4. **One change at a time.** No bulk rewrites of HTML/CSS. Incremental, verifiable edits only.
5. **Minimal impact.** Touch only what's necessary. Don't refactor unrelated code while fixing something else.
6. **Root causes only.** No temporary patches. Find and fix the actual problem.

---

## WEBSITE-SPECIFIC STANDARDS

### Performance

- Lazy-load images below the fold using `loading="lazy"` or framework equivalent.
- Use `next/image`, `<picture>`, or equivalent for responsive images — never raw `<img>` without width/height.
- Prefer system fonts or preloaded web fonts. Never add a font without checking if it's already loaded.
- Flag any added dependency that significantly increases bundle size before adding it.

### Accessibility

- All images must have descriptive `alt` text. Decorative images use `alt=""`.
- Interactive elements must be keyboard-navigable and have visible focus states.
- Colour contrast must meet WCAG AA minimum (4.5:1 for body text, 3:1 for large text).
- Use semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` — not div soup.

### SEO

- Every page needs a unique `<title>` and `<meta name="description">`.
- Use one `<h1>` per page. Heading hierarchy must be logical (h1 → h2 → h3).
- URLs must be lowercase, hyphenated, and human-readable.
- Add `canonical` tags on pages with duplicate or near-duplicate content.
- Structured data (JSON-LD) for key page types where applicable.

### Responsive Design

- Mobile-first CSS. Start with the smallest breakpoint and scale up.
- Test at 375px (mobile), 768px (tablet), 1280px (desktop) minimum.
- No horizontal scroll at any standard breakpoint.
- Touch targets must be at least 44×44px.

### Cross-Browser

- Test in Chrome and Firefox minimum. Flag any Safari-specific CSS quirks.
- Never use a CSS property without checking baseline browser support. If support is <90% global, flag it.

---

## ELEGANCE CHECK

For any non-trivial change, pause before presenting and ask:

> "Knowing everything I know now, is this the elegant solution?"
> 

If no — implement the elegant version. Skip this for simple, obvious fixes. Don't over-engineer.

---

## BUG & LAYOUT FIXING

When given a bug or visual defect: fix it without asking for hand-holding.

- Inspect the relevant markup and styles first.
- Identify root cause — not symptoms.
- State what was wrong and what was changed, then verify the fix.
- No back-and-forth required unless the scope is genuinely unclear.

---

## SUBAGENTS

- Use subagents to keep the main context window clean.
- Offload research, design exploration, and parallel analysis to subagents.
- One focused task per subagent.
- For complex work (multi-page redesigns, component audits, SEO analysis): use subagents rather than cramming into one context.

---

## TASK FILES

```
tasks/
  todo.md      ← current task plan with checkboxes + review summary on completion
  lessons.md   ← running log of mistakes and rules learned
```

Any task touching site architecture, navigation, or multiple pages/components must have a `tasks/todo.md` entry before work begins.

---

## PROJECT-SPECIFIC OVERRIDES

> Add your framework, CMS, design system, deployment target, font/colour tokens, and any additional rules below this line.
>
