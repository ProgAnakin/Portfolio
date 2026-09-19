/**
 * Shelf geometry, with no three.js in sight.
 *
 * The DOM control layer needs these numbers to work out how far a product may
 * be dragged, and importing them from a module that touches three.js would
 * drag the whole 3D stack into the entry bundle.
 */
export const SHELF_X = -1.6;
export const SHELF_HALF_WIDTH = 2.2;
export const SHELF_Y = [2.3, 1.42, 0.54];
export const SLOT_GAP = 1.25;
export const SHELF_DEPTH = 0.72;
export const PLANK_THICKNESS = 0.07;

/** Where a product stands, from its shelf and slot. */
export function placement(shelf: number, slot: number): [number, number, number] {
  return [SHELF_X - 0.75 + slot * SLOT_GAP, SHELF_Y[shelf] ?? SHELF_Y[0], 0.05];
}

/** How much lift the top shelf gets, where there is no plank to hit. */
export const OPEN_LIFT = 0.42;

/**
 * The gap between a shelf's surface and the underside of the one above it, or
 * `null` on the top shelf, which has open air over it.
 */
export function shelfGap(shelf: number): number | null {
  const here = SHELF_Y[shelf] ?? SHELF_Y[0];
  const above = SHELF_Y[shelf - 1];
  if (above === undefined) return null;
  return above - PLANK_THICKNESS - here;
}
