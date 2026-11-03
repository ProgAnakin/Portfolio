# Costanzo Annichini, portfolio

The portfolio of a salesperson who builds software. One page, laid out like a
printed brochure: a black cover (who he is, four numbers), white pages (the
sales record, then the work) and a black back cover (contact). Black, white
and greys only; the colour on the page belongs to the projects, which sit in
greyscale until they are pointed at.

Type is Archivo, one variable family: its widest cut in capitals for the name
and section labels, normal width for everything else. Copy is short, first
person and plain: no slogans, no em dashes.

The 3D shop this site used to be is kept on the `archive/3d-shop` branch.

## Running it

```bash
npm install
npm run dev      # vite dev server
npm run build    # typecheck + production build to dist/
npm run preview  # serve the built site
npm run lint     # typecheck only
npm run verify   # typecheck + build + audit all dependencies
npm test         # browser regression checks (Chromium)
```

Deploys two ways from the same commit:

- **Vercel** — `vercel.json` sets security headers, font revalidation and
  long-lived cache headers for hashed assets. Serves from `/`.
- **GitHub Pages** — `.github/workflows/deploy.yml` builds and publishes when
  triggered manually in Actions. A project page is served from `/<repo>/`, so the
  workflow passes `VITE_BASE`; `vite.config.ts` reads it rather than
  hardcoding a base.

## Validation and browser tests

Use Node.js 24 (the CI uses the same major version) and `npm ci` with the
committed lockfile. `npm run verify` checks types, builds and audits production
and development dependencies. The Validate workflow runs on pull requests and
pushes to `main`; Pages deployment is a separate manual workflow.

Before the first browser test run, install Chromium with
`npx playwright install --with-deps chromium`, then run `npm test`. If this
machine already has Chromium, select it with
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test`.
Tests start and stop their own local preview server. They cover sales figures,
case links and browser history, focus return, media, preview pause controls,
reduced motion, mobile navigation and automated accessibility checks.

Cases can be shared with `#case/<project id>` (for example,
`#case/caderninho`). Reloading retains the case, and Back returns to the page.
The Work section has a pause/play control for preview loops. Reduced-motion
preferences are applied both on load and when they change during a visit.

Sales totals and the confirmed lowest/highest individual item prices are
maintained in `src/data/profile.ts`. The page presents totals and price breadth;
it does not present an average receipt as a typical sale. The reporting end date
and exact contract dates have not been supplied, so the copy uses recorded
totals and contract progression
without assigning dates. Update the metadata in `index.html` and `public/og.jpg`
when changing the headline figures. Run `npm run social` to regenerate the
1200×630 social card from the profile data (requires Chromium as above). Source
documents should stay private.

## Where things live

| What | File |
|---|---|
| Name, headline figures, the shop-floor record, how I sell, contacts | [`src/data/profile.ts`](src/data/profile.ts) |
| The projects, in reading order | [`src/data/projects.ts`](src/data/projects.ts) |
| A project's case media | [`src/assets/shots/<project id>/`](src/assets/shots/README.md), drop files in |
| A project's card loop | `src/assets/previews/<project id>.mp4` and `.webp`, imported in `projects.ts` |
| Project logos | `src/assets/logos/` |
| Colours and type | [`src/index.css`](src/index.css) |

**Every number on the page has to survive "how do you know?" asked out loud.**
Personal figures come from the job; project figures sit on the project that
earned them; nothing is totalled across projects that were built unpaid.

## Adding a project

One object in `src/data/projects.ts` (the first one in the array is shown as
the featured case), a logo in `src/assets/logos/`, and — optionally — a folder
of media named after its `id`. Its case opens in a dialog, so the main page
does not grow with it.

## What the page does not do

- It loads nothing from anyone else: no analytics, no font CDN, no embeds.
  Fonts are self-hosted; the Content-Security-Policy in `index.html` and
  `vercel.json` would block anything else.
- It does not publish a personal email address. Contact is LinkedIn; email is
  "available on request".
- Nothing animates on scroll. The card videos play only while on screen, and
  not at all under `prefers-reduced-motion`.
- Runtime dependencies are React and React DOM, nothing else.

## LinkedIn launch review

The `review/linkedin-launch` branch contains the review changes. Publishing that
branch to GitHub should request a Vercel Preview deployment through the existing
Git integration; production remains on `main` until the review is approved.

The browser tests cover visible focus after closing a directly shared case,
video chapter state after switching media, and pausing background previews while
a case is open. Closing the case preserves the visitor's manual pause setting.

Before promoting the review:

- Confirm the reporting period for the sales totals and the exact contract dates.
- Restore Suaipe's 76% conversion figure only with its definition, period and sample.
- Restore Caderninho's 0.7-second benchmark and 549-check count only with current,
  reproducible evidence. Those project metrics are omitted from this preview.
- Verify the AI Call Trainer destination. Its URL was taken from the repository's
  public website field, not inferred from the project name.
- Check the Vercel deployment and run the production URL through LinkedIn Post
  Inspector before sharing. Local tests do not verify the deployed version or
  LinkedIn's cached preview.
