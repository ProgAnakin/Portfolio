import kouciUrl from '../assets/brand/kouci.webp';
import suaipeUrl from '../assets/brand/suaipe.webp';
import type { BrandMark } from '../data/projects';

/**
 * The real marks.
 *
 * Suaipe and Kouci exist, and they have logos that someone designed. Redrawing
 * those in code produced a decent likeness and the wrong thing: a brand is the
 * artwork, not an approximation of it, and a portfolio that redraws its own
 * clients' identities is showing work it did not do. So the actual files ship,
 * keyed off the black background they were delivered on and trimmed to the
 * mark. The trainer has no identity yet, so it keeps the one invented for it in
 * `logos` — that one is honestly a drawing.
 *
 * Loaded once and cached, because the same mark is printed on the packaging,
 * the project sheet and the store directory, and decoding it three times is
 * three times the work for one picture.
 */
const FILES: Partial<Record<BrandMark, string>> = {
  suaipe: suaipeUrl,
  kouci: kouciUrl,
};

const decoded = new Map<BrandMark, HTMLImageElement | null>();
const inFlight = new Map<BrandMark, Promise<HTMLImageElement | null>>();

export function loadMark(mark: BrandMark): Promise<HTMLImageElement | null> {
  if (decoded.has(mark)) return Promise.resolve(decoded.get(mark) ?? null);
  const existing = inFlight.get(mark);
  if (existing) return existing;

  const src = FILES[mark];
  if (!src || typeof document === 'undefined') {
    decoded.set(mark, null);
    return Promise.resolve(null);
  }

  const job = new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    // A missing file is not worth breaking a shelf over: the drawn mark in
    // `logos` is a complete fallback.
    img.onerror = () => resolve(null);
    img.src = src;
  }).then((img) => {
    decoded.set(mark, img);
    inFlight.delete(mark);
    return img;
  });

  inFlight.set(mark, job);
  return job;
}

/** The mark if it is already decoded, for painters that cannot await. */
export function markImage(mark: BrandMark): HTMLImageElement | null {
  return decoded.get(mark) ?? null;
}
