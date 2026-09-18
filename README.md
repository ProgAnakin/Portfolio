# The Shop

The portfolio of Costanzo Annichini, laid out as a shop interior at night —
a room you can walk into on a desktop, a drawing you can scroll on a phone.
Every project is a product on a shelf with its own designed packaging: in
stock, out of stock, or a gap with a *restocking soon* card on it. You can
pick things up and pull them off the shelf. The counter has a telephone
(contacts) and a till that prints a receipt for your visit.

The conceit is the point. The career started on a shop floor and moved into
software — so retail is the origin and technology is the product.

## Running it

```bash
npm install
npm run dev      # vite dev server
npm run build    # typecheck + production build to dist/
npm run preview  # serve the built site
npm run lint     # typecheck only
```

Deploys two ways from the same commit:

- **Vercel** — `vercel.json` sets the build and long-lived cache headers for
  fonts and hashed assets. Serves from `/`.
- **GitHub Pages** — `.github/workflows/deploy.yml` builds and publishes on
  every push to `main`, or on demand from the Actions tab. A project page is
  served from `/<repo>/`, so the workflow passes `VITE_BASE`; `vite.config.ts`
  reads it rather than hardcoding a base, which is why the same commit works
  on both. Pages needs enabling once: **Settings → Pages → Source: GitHub
  Actions**.

## Adding a project

One object in [`src/data/projects.ts`](src/data/projects.ts). The shelves,
lighting, price tags, product sheet, mobile sections and the receipt all
derive from that array.

```ts
{
  id: 'new-thing',            // also the anchor id
  name: 'New Thing',
  tagline: 'One line, read at a glance on hover',
  status: 'in-stock',         // 'in-stock' | 'out-of-stock' | 'restocking'
  shelf: 1,                   // 0 is the top shelf
  slot: 1,                    // position along that shelf
  shape: 'tin',               // which drawing stands on the shelf
  tint: 'mustard',
  tag: { kind: 'SOMETHING', year: '2026' },
  description: '…',
  role: '…',
  stack: ['…'],
  links: [{ label: 'Live', href: 'https://…' }],
}
```

- `SHELF_COUNT` controls how many shelves the unit has. A shelf with nothing
  on it renders short, with a *restocking soon* tag — that is deliberate, not
  a placeholder to remove.
- `shape` picks a drawing from `src/components/shop/products/`. To add a new
  one: write the SVG component there, register it in that folder's
  `index.tsx` (`productArt` and `productScale`), and add its name to
  `ProductShape`.
- `tint` names a colour in `:root` in `src/index.css` (`--prod-*`). These sit
  outside Tailwind's `@theme` on purpose: they are picked by name at runtime,
  and Tailwind drops theme variables it cannot see referenced in source.

Everything else about the shop — the sign, the chalkboard menu, the contacts
and what the receipt says — lives in
[`src/data/profile.ts`](src/data/profile.ts).

## Two shops, one set of data

There are two renderings of the same place, and neither is the other one
degraded.

**The room** (`src/three/`) is the desktop version: a real WebGL scene built
with react-three-fiber. Everything in it is procedural — primitives, no
model files, no downloaded HDRI, nothing to fetch. The packaging artwork on
each box is drawn onto a canvas at runtime from the same `projects.ts` entry.

**The drawing** (`src/components/shop/`) is the version phones, tablets,
metered connections, reduced-motion visitors and anyone without WebGL get:
inline SVG, instant, scrollable, and art-directed for each width on its own
terms. `useSceneQuality` decides, and the 3D bundle is never fetched when the
answer is no.

### How the room is put together

- **Materials are meaning, not decoration.** Five finishes — plastic, clay,
  rubber, chrome, card — and a project declares which one it is made of. The
  unfinished project ships in plain cardboard because it is not finished; the
  shopkeeper is clay because clay has no highlight and stays a silhouette;
  the till is the only chrome in the shop so it has something to reflect.
- **Lighting is fixtures.** Every light is a thing you can see: the strip
  under each shelf lip, the pendant over the counter. There is no studio
  HDRI — the environment is built from the shop's own strip lights
  (`Lighting.tsx`), so chrome reflects *this room*. That is most of what
  separates it from a default three.js scene.
- **Type is architecture.** The shop name is painted on the back wall at
  signage scale (`WallSign.tsx`), lit by the shelves and cropped by whatever
  is standing in front of it — not floated over the canvas in a DOM layer.
- **Motion is a toy.** One spring (`spring.ts`) with deliberate overshoot
  drives every lift, squash and drag. Products squash as they leave the shelf
  and stretch at the top of the lift; volume is conserved, which is what makes
  them read as plastic rather than as cards.
- **The shopkeeper is drawn, not modelled.** Building a face out of spheres
  produced something crude every time, so they are a flat illustration
  (`standeeArt.ts`) standing in the room — a cut-out standee by the till,
  which is also the most honest object for a shop to contain. Painted with
  their light already in it so the scene cannot re-light them into mud. The
  pupils and lids are separate planes: they follow the visitor and they blink,
  which is worth more than any amount of geometry.
- **Each product is a display, not a box.** The kiosk is tipped back with a
  quiz card caught mid-swipe; the boxed set leans so its top face shows, with
  the ball out of the box in front of it; the unfinished project is a shipping
  carton with its flaps still up. Every one gets a shelf talker
  (`ShelfTalker.tsx`) clipped to the lip below it — the piece of retail
  furniture that turns a row of objects into a display, and where the status
  shouts. Talkers belong to the shelf, so they stay put when stock is lifted.

### Controls are DOM, always

The canvas is `aria-hidden` decoration. Every interactive thing — each
product, the telephone, the till — is an ordinary `<button>` in
`HotspotLayer`, positioned over the canvas by projecting the object's world
position to the screen each frame (`HotspotProjector` writes, an animation
frame in the layer reads). Hover and drag state travels through plain mutable
records, so pulling a box off a shelf never triggers a React render.

The same is true of the drawing: each product there is a real `<button>`
wrapping its own SVG. Focus, labelling and keyboard behaviour work like
ordinary controls in both, and the artwork stays sharp and individually
interactive.

- `src/components/shop/SceneDefs.tsx` — every filter and gradient the scene
  shares, in one node. The hand-drawn wobble is a `feTurbulence` +
  `feDisplacementMap` filter applied to structural shapes, so the whole
  drawing looks like one hand made it.
- `src/components/GrainOverlay.tsx` — paper grain and vignette over the lot.
  This is what stops the flat fills reading as vector art.
- Shelf and counter geometry are CSS variables (`--shelf-h`, `--plank-h`,
  `--counter-item-h`, `--counter-block-h`) set per breakpoint in
  `src/index.css`. The lamp's cone lands on the counter top and the counter
  cuts the shopkeeper at the waist because both are measured off those.

### Responsive art direction

| Width | What you get |
| --- | --- |
| `< 40rem` | the drawing, unrolled — one product per shelf section, at full size, counter last |
| `40–64rem` | the drawing, with real shelves and the counter beneath them |
| `≥ 64rem` | the room, in 3D, with the counter to the right |

Nothing is ever scaled down to fit. A phone gets a different composition, not
a squeezed one, and the room is kept for windows wide enough to hold it —
a perspective camera's `fov` is vertical, so a narrow window crops the sides.
`CameraRig` solves the distance from the viewport aspect every resize rather
than trusting a constant that happened to look right at one size.

### Performance

The 3D chunk is roughly 250 KB gzipped and the entry bundle is roughly 115 KB.
A device that does not get the room never downloads the chunk at all — worth
re-checking after any change, because a single static import from `src/three/`
into a component the entry bundle reaches will silently merge the two
(`shapeMetrics.ts` exists precisely to avoid that). The scene also stops
rendering entirely when the tab is in the background.

## The receipt

On the way out — the pointer heading for the top of the window — the shop
calls after you once: *don't forget your receipt*, with an arrow tracking the
actual till control. It is a nudge and nothing more. No `beforeunload`
dialog, nothing that argues with the browser, nothing that can trap anybody;
a shop can call after you, it cannot lock the door. It never returns once the
till has printed or once it has been dismissed, and it never fires on a touch
device, which has no pointer to lose.

The till prints a record of the visit, not a CV: the projects you actually
opened, as line items, plus a short introduction and contacts. Nothing on it
is information that would not be handed to someone who walked into the shop.
`Print / save` uses the browser's print dialog against a print stylesheet
that puts the paper on the page and nothing else.

## Accessibility

- A persistent text nav (Projects / About / Contact / Receipt) and a skip
  link, so nobody has to explore a drawing to find the work.
- Every interactive element is a real control with an `aria-label` and a
  visible focus ring; tab order runs skip link → nav → products → phone →
  till.
- All artwork is `aria-hidden`; `ReadableIndex` carries the same content as
  plain semantic HTML for screen readers and crawlers, since the detail
  sheets only exist once opened.
- Both overlays are focus-trapped dialogs that close on `Escape` and hand
  focus back.
- `prefers-reduced-motion` stops the parallax, the strip-light flicker and
  the printing animation; the receipt simply appears.
