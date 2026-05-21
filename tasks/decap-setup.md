# Decap CMS — setup & usage

A Webflow-style content editor is now installed at `/admin/`. This doc explains
what was added, the three ways to authenticate, daily use, and known limits.

---

## a. What's installed

- `public/admin/index.html` — the admin shell that loads Decap CMS from a CDN
  (pinned to `decap-cms@^3.0.0`). No npm dependency added.
- `public/admin/config.yml` — the CMS configuration: backends, media folder,
  editorial workflow, and the **Blog** collection mapped 1:1 to the Zod schema
  in `src/content.config.ts`.
- `public/uploads/.gitkeep` — empty placeholder so the upload directory exists
  in Git. Uploaded images land here and are served from `/uploads/...`.

How it works: Decap is a pure-JS SPA. When you visit `/admin/`, it loads,
authenticates you, and commits Markdown files directly to the Git repo. There
is no database and no server-side runtime. Astro picks up the new Markdown on
the next build.

The **editorial workflow** is enabled, so every post moves through
`Draft → In Review → Ready → Published` (a kanban that feels like Webflow's
publish flow).

---

## b. Pick one of three auth modes

### Mode 1 — Local-only, no auth (fastest to try right now)

Use this to evaluate the CMS without deploying anything. Posts save straight to
disk in `src/content/blog/`.

1. In `public/admin/config.yml`, comment out the active `git-gateway` block
   (lines under `# --- ACTIVE BACKEND ---`).
2. Uncomment the `proxy` block under `# --- ALTERNATE BACKEND 2 ---`.
3. In a new terminal, run:
   ```bash
   npx decap-server
   ```
   This starts a proxy on port 8081 that writes to your local filesystem.
4. Make sure the Astro dev server is also running:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5000/admin/` in your browser. No login prompt.
6. Create / edit posts — they save to `src/content/blog/*.md` immediately.

**Caveats:** anyone on your local network who can reach port 5000 can edit
content. Don't expose port 5000 publicly while the proxy is running.

---

### Mode 2 — Netlify Identity + Git Gateway (recommended for production)

This is the path the default `config.yml` is wired for. Zero code changes
needed after deploy.

1. Push the repo to GitHub (it's already at `github.com/vasprisin/vasprisin.com`).
2. Create a new Netlify site and connect it to that GitHub repo. Set build
   command `npm run build` and publish directory `dist`.
3. In the Netlify dashboard for the site, open **Site configuration →
   Identity** and click **Enable Identity**.
4. Under **Identity → Registration**, set it to **Invite only** (you do not
   want public signup on your admin).
5. Under **Identity → Services → Git Gateway**, click **Enable Git Gateway**.
   This lets Decap commit to GitHub on a logged-in user's behalf without you
   handing out repo access.
6. Under **Identity → Invite users**, invite your own email. You'll get an
   email with a one-time link — set a password.
7. Point `vasprisin.com` DNS at the Netlify site (or use the netlify.app
   subdomain temporarily).
8. Visit `https://vasprisin.com/admin/` → "Login" → enter your Identity
   credentials → you're in.

---

### Mode 3 — GitHub OAuth (works on any host, including Replit)

Use this if you'd rather not put the site on Netlify. You still need an OAuth
proxy somewhere; the easiest option is Netlify's free hosted one (you don't
have to host the site there — only the OAuth handshake).

1. Go to GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Fill in:
   - **Homepage URL:** `https://vasprisin.com`
   - **Authorization callback URL:** `https://api.netlify.com/auth/done`
3. Copy the **Client ID** and **Client Secret**.
4. Create a free Netlify account, create any empty site, then in **Site
   configuration → Access & security → OAuth → Install provider**, add GitHub
   with the Client ID + Secret from step 3.
5. In `public/admin/config.yml`, comment out the active `git-gateway` block
   and uncomment the `github` block under `# --- ALTERNATE BACKEND 1 ---`.
6. Redeploy the site so the new `config.yml` is live.
7. Visit `https://vasprisin.com/admin/` → click **Login with GitHub** →
   authorize the OAuth app → you're in.

If you'd rather not use Netlify at all for OAuth, you can self-host the OAuth
proxy (e.g. `vencax/netlify-cms-github-oauth-provider`) and set `base_url` in
the `github` backend block — see the commented `base_url` line in `config.yml`.

---

## c. Day-to-day use

1. Go to `https://vasprisin.com/admin/` (or `http://localhost:5000/admin/` in
   local mode).
2. **Blog → New Post**. Fill in:
   - **Title** — the post title.
   - **Description** — one or two sentences; this becomes the SEO description.
   - **Date** — defaults to now; change for backdating.
   - **Author** — pre-filled with `Priyanshu Singh`.
   - **Tags** — type a tag, press enter, repeat.
   - **Cover image** — optional; click to upload (lands in `public/uploads/`).
   - **Draft** — leave off for posts you intend to ship.
   - **Body** — Markdown WYSIWYG with rich-text toolbar, image insertion,
     code blocks, etc.
3. Hit **Save** — this creates a draft entry on a branch.
4. Move it through the **Workflow** kanban: `Drafts → In Review → Ready`.
5. From **Ready**, click **Publish now** — Decap merges the branch into `main`
   and the post is committed.
6. Your host rebuilds:
   - **Netlify:** auto-builds on every commit. Live in ~30s.
   - **Replit / other:** you need to trigger a redeploy after the commit lands.
7. Uploaded images get the URL `/uploads/filename.ext`. Reference them in
   Markdown as `![alt](/uploads/filename.png)` or pick them from the cover
   image field.

---

## d. Known limitations / to-do

- **Publications page is not yet editable.** `src/pages/publications.astro`
  currently uses a hardcoded TypeScript array of `Publication` objects. Decap
  can only edit files, not inline TS literals. To make publications editable:
  1. Add a `publications` collection in `src/content.config.ts` with the
     matching schema.
  2. Move each publication into its own `src/content/publications/<slug>.md`.
  3. Refactor `publications.astro` to query the collection with
     `getCollection('publications')`.
  4. Add a matching `- name: "publications"` collection block to
     `public/admin/config.yml`.
  Until that's done, only the **Blog** is CMS-editable.

- **`robots.txt` needs two extra Disallow rules.** A parallel SEO agent is
  generating `public/robots.txt`. Once it lands, add these two lines so search
  engines don't index your admin or uploaded assets:
  ```
  Disallow: /admin/
  Disallow: /uploads/
  ```

- **Astro Content Collections rebuild requirement.** New posts only show up on
  the live site after Astro rebuilds. In local dev (`npm run dev`) this is
  automatic. In production on Netlify it's automatic on commit. On any other
  static host you must redeploy.

- **Image optimisation.** Decap stores uploaded images as-is. Astro's `<Image>`
  component will not optimise files under `public/`. If you want optimised
  cover images, move them into `src/assets/` and update the schema to use
  `image()` instead of `z.string()` — but that requires referencing images by
  import path rather than URL, which Decap can't easily do. Current setup
  trades optimisation for editability.

---

## File map

```
public/
  admin/
    index.html      ← the admin SPA shell
    config.yml      ← collections, backends, media config
  uploads/
    .gitkeep        ← placeholder; uploaded media lands here
```
