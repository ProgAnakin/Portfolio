import { SHELF_HALF_WIDTH, SHELF_X } from './shelfLayout';

/**
 * Backstock: the unbranded boxes filling the shelves, with no three.js in
 * sight.
 *
 * Three products on three shelves reads as a shop going out of business, so
 * these exist to make the fixture look stocked. They are also *furniture* —
 * they never move, which makes them a wall as far as a dragged product is
 * concerned. That is why the layout lives here rather than inside the
 * component that draws it: the clamp in `shapeMetrics` has to read it, and it
 * cannot import anything that touches three.
 */
export interface StockBox {
  shelf: number;
  /** Position along the shelf, measured from the middle of the fixture. */
  x: number;
  w: number;
  h: number;
  d: number;
  rot: number;
}

export const STOCK: StockBox[] = [
  { shelf: 0, x: -1.95, w: 0.3, h: 0.42, d: 0.28, rot: 0.08 },
  { shelf: 0, x: 1.75, w: 0.34, h: 0.46, d: 0.3, rot: -0.06 },
  { shelf: 1, x: 0.5, w: 0.4, h: 0.34, d: 0.34, rot: -0.04 },
  { shelf: 1, x: 1.3, w: 0.46, h: 0.5, d: 0.34, rot: 0.08 },
  { shelf: 1, x: 1.74, w: 0.28, h: 0.3, d: 0.26, rot: -0.14 },
  { shelf: 2, x: -1.5, w: 0.52, h: 0.28, d: 0.4, rot: 0.02 },
  { shelf: 2, x: -0.95, w: 0.44, h: 0.24, d: 0.36, rot: -0.06 },
  { shelf: 2, x: 1.5, w: 0.38, h: 0.42, d: 0.3, rot: 0.11 },
];

/** Where a box actually stands, kept on the plank rather than over its end. */
export function stockX(box: StockBox): number {
  const limit = SHELF_HALF_WIDTH - 0.4;
  return SHELF_X + Math.max(-limit, Math.min(limit, box.x));
}
