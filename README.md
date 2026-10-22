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
```

Deploys two ways from the same commit:

- **Vercel** — `vercel.json` sets the security headers and long-lived cache
  headers for fonts and hashed assets. Serves from `/`.
- **GitHub Pages** — `.github/workflows/deploy.yml` builds and publishes on
  every push to `main`. A project page is served from `/<repo>/`, so the
  workflow passes `VITE_BASE`; `vite.config.ts` reads it rather than
  hardcoding a base.

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
