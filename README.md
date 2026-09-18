# The Shop

The portfolio of Costanzo Annichini, laid out as an illustrated shop interior
at night. Every project is a product on a shelf: in stock, out of stock, or a
gap with a *restocking soon* card on it. The counter on the right has a
telephone (contacts) and a till that prints a receipt for your visit.

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

Deploys to Vercel as a static site; `vercel.json` sets the build and the
long-lived cache headers for fonts and hashed assets.

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

## How the scene is put together

The shop is inline SVG, but it is not one big SVG. Each product, the phone
and the till are real `<button>`s wrapping their own drawing, laid out with
CSS. That keeps focus, labelling and keyboard behaviour working like ordinary
controls while the artwork stays sharp and individually interactive.

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

### Three layouts, one DOM

| Width | Shelves | Counter |
| --- | --- | --- |
| `< 40rem` | unrolled — one product per shelf section, at full size | last section |
| `40–64rem` | real shelves, products side by side | below the shelves |
| `≥ 64rem` | real shelves | beside them, on the right |

The scene is never scaled down to fit a phone; it re-flows. Only the shelf
*grouping* is decided in JS (`useShelvedLayout`), and the DOM order is
identical either way, so nothing about the reading order changes.

## The receipt

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
