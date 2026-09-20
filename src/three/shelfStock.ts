import { freeSlots, SHELVES, SLOTS_PER_SHELF } from '../data/shelving';
import { SHELF_HALF_WIDTH, SHELF_X, slotX } from './shelfLayout';

/**
 * Backstock: the unbranded boxes filling the shelves, with no three.js in
 * sight.
 *
 * Three products on three shelves reads as a shop going out of business, so
 * these exist to make the fixture look stocked. They are also *furniture* —
 * they never move, which makes them a wall as far as a dragged product is
 * concerned, and that is why the layout lives here rather than inside the
 * component that draws it: the clamp in `shapeMetrics` has to read it, and it
 * cannot import anything that touches three.
 *
 * They are generated from whatever the inventory has *not* taken, rather than
 * placed by hand. Hand-placed filler is a trap the fourth project falls into:
 * you add a product, it lands inside a cardboard box nobody remembered, and
 * nothing tells you. Here the box is gone the moment the slot is claimed.
 */
export interface StockBox {
  shelf: number;
  /** Absolute world x. */
  x: number;
  w: number;
  h: number;
  d: number;
  rot: number;
}

/** Stable pseudo-random in [0, 1) — the same shelf looks the same every load. */
function noise(a: number, b: number): number {
  const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function box(shelf: number, x: number, seed: number): StockBox {
  const a = noise(seed, shelf);
  const b = noise(shelf * 3.7, seed * 1.9);
  return {
    shelf,
    x,
    w: 0.28 + a * 0.26,
    h: 0.24 + b * 0.28,
    d: 0.26 + a * 0.14,
    rot: (b - 0.5) * 0.3,
  };
}

/**
 * Where the filler goes: the slots no product claimed, plus the spare plank
 * either side of the run of slots.
 */
export function backstock(): StockBox[] {
  const out: StockBox[] = [];

  for (const { shelf, slot } of freeSlots()) {
    const centre = slotX(slot);
    const pair = noise(shelf * 11.3, slot * 5.1) > 0.45;
    out.push(box(shelf, centre - (pair ? 0.24 : 0), slot * 7 + shelf));
    if (pair) out.push(box(shelf, centre + 0.28, slot * 13 + shelf * 3 + 1));
  }

  // The plank runs on past the last slot on either side. Left is usually a
  // sliver; right is where the fixture's spare width ends up.
  const first = slotX(0) - 0.72;
  const last = slotX(SLOTS_PER_SHELF - 1) + 0.72;
  const bands: [number, number][] = [
    [SHELF_X - SHELF_HALF_WIDTH + 0.34, first],
    [last, SHELF_X + SHELF_HALF_WIDTH - 0.34],
  ];

  for (let shelf = 0; shelf < SHELVES; shelf += 1) {
    bands.forEach(([from, to], side) => {
      const room = to - from;
      if (room < 0.4) return;
      const count = Math.min(3, Math.floor(room / 0.52));
      for (let i = 0; i < count; i += 1) {
        const t = count === 1 ? 0.5 : (i + 0.5) / count;
        out.push(box(shelf, from + room * t, shelf * 17 + side * 5 + i));
      }
    });
  }

  return out;
}
