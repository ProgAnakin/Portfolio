/**
 * When the till last printed.
 *
 * The button that prints is ordinary DOM and the machine that prints is in
 * the scene, so something has to carry the news across. A plain mutable record
 * read from `useFrame`, exactly like `hotspots` — a state setter here would
 * re-render the tree on a keystroke that is meant to be a mechanism turning.
 *
 * Deliberately free of three.js: the entry bundle reaches this file, and an
 * import from it into the 3D stack would drag the whole room onto phones that
 * never draw it.
 */
export const till = {
  /** `performance.now()` of the last print, or 0 if nothing has printed. */
  printedAt: 0,
  /** How many receipts this visit. The machine sounds busier the more it has done. */
  count: 0,
};

export function tillPrinted() {
  till.printedAt = typeof performance === 'undefined' ? 0 : performance.now();
  till.count += 1;
}

/** Seconds since the last print, or `null` if it has never run. */
export function sincePrint(now: number): number | null {
  if (!till.printedAt) return null;
  return (now - till.printedAt) / 1000;
}
