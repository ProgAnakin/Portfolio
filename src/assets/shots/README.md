# Screenshots and clips

Drop files in the folder named after the project's `id` in
`src/data/projects.ts`. Nothing else to edit — the casebook picks them up at
build time and the card grows a media strip. A project with an empty folder
simply has no strip, which is the right answer for one that is still being
built.

```
src/assets/shots/
  kouci/            ← project id
  suaipe/
  ai-call-trainer/
```

## The filename is the caption

`02-the-swipe-quiz.webp` is captioned **The swipe quiz**. The leading number
orders the strip and is not shown; dashes and underscores become spaces. The
caption is also what a screen reader reads, so write it for someone who cannot
see the picture — *The swipe quiz*, not *screenshot 2*.

## What to put in

- **Images** — `.webp`, `.avif`, `.png`, `.jpg`. WebP at about 1600px wide is
  the sweet spot: sharp on a laptop, around 100–200 KB. Anything over ~400 KB
  is worth re-exporting; every visitor pays for it.
- **Video** — `.mp4` (H.264) or `.webm`. Keep it under ~20 seconds and a few
  megabytes. It loads its poster frame only until someone presses play, so a
  clip nobody watches costs almost nothing.

Three or four per project is plenty. The strip is evidence, not a gallery.

## What not to put in

Anything with a real customer's name, a real order, a price list you were not
meant to publish, or a dashboard with live figures on it. This folder ships to
the public internet exactly as it is.
