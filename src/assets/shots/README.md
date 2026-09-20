# Screenshots and clips

One folder per project, named after its `id` in `src/data/projects.ts`. Drop
files in; there is nothing to edit anywhere else. The casebook picks them up at
build time and the project's card grows a media block.

```
src/assets/shots/
  kouci/
  suaipe/
  ai-call-trainer/
```

## The shape the card is built for

**One clip and three stills.** The clip runs full width across the top of the
card; the stills sit in a row underneath, all three visible at once, each one
clickable to open full size. Nothing is hidden behind a swipe.

It copes with other counts — one still fills the width, two sit side by side,
four wrap onto a second row, no clip is fine and so is no media at all — but
three across is the shape it was drawn for.

```
kouci/
  00-walkthrough.mp4           ← the clip
  01-live-match-stats.webp     ← the stills
  02-penalty-shot-map.webp
  03-roster-management.webp
```

Keep `00-` for the clip so it sorts first, and number the stills in the order
you want them read.

## The filename is the caption

`02-penalty-shot-map.webp` is captioned **Penalty shot map**. The leading
number orders things and is never shown; dashes and underscores become spaces.

It is also the alt text a screen reader announces and what a search engine
indexes, so write it for someone who cannot see the picture — *Penalty shot
map*, not *screenshot 2*.

## Sizes

- **Stills** — `.webp`, `.avif`, `.png`, `.jpg`. WebP around 1600px wide is the
  sweet spot: sharp when opened full size, usually 100–200 KB. Over ~400 KB is
  worth re-exporting; every visitor pays for it.
- **Clips** — `.mp4` (H.264) or `.webm`. Twenty to forty seconds, a few
  megabytes. It shows its first frame and downloads nothing else until someone
  presses play, so a clip nobody watches is close to free. No sound is needed —
  it is muted until they unmute it.

A phone-shaped screenshot is fine. Nothing is ever cropped to fit: it is
letterboxed against the dark instead, because the top of a dashboard is usually
the part worth seeing.

## What not to put in

Anything with a real customer's name, a real order, an internal price list, or
a dashboard with live figures on it. This folder ships to the public internet
exactly as it is, and a screenshot is not something you can quietly take back.
