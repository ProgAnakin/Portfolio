import { SLOTS_PER_SHELF } from '../data/shelving';

/**
 * Shelf geometry, with no three.js in sight.
 *
 * The DOM control layer needs these numbers to work out how far a product may
 * be dragged, and importing them from a module that touches three.js would
 * drag the whole 3D stack into the entry bundle.
 *
 * The fixture is sized from the inventory rather than pinned to a constant
 * that happened to fit three products. It grows *leftward* — its right-hand
 * end stays put, because that is where the counter begins and a shelf that
 * grows into the till is not a shelf that grows.
 */
export const SLOT_GAP = 1.25;
export const SHELF_DEPTH = 0.72;
export const PLANK_THICKNESS = 0.07;
export const SHELF_Y = [2.3, 1.42, 0.54];

/** Where the fixture stops, and the counter's half of the room begins. */
const SHELF_RIGHT = 0.6;

/** Slot 0 sits this far left of the fixture's middle at the smallest size. */
const FIRST_SLOT_INSET = 0.75;

export const SHELF_HALF_WIDTH = Math.max(2.2, (SLOTS_PER_SHELF - 1) * SLOT_GAP + 0.55);
export const SHELF_X = SHELF_RIGHT - SHELF_HALF_WIDTH;

/**
 * How far the strip light hangs below the plank it is tucked under.
 *
 * It matters because the strip, not the plank, is the lowest thing over a
 * product's head — and a box that clears the plank but goes through the light
 * bar is still a box going through the shelf.
 */
export const STRIP_DROP = 0.09;

/** Where along the fixture a slot's middle falls. */
export function slotX(slot: number): number {
  return SHELF_X - FIRST_SLOT_INSET + slot * SLOT_GAP;
}

/** Where a product stands, from its shelf and slot. */
export function placement(shelf: number, slot: number): [number, number, number] {
  return [slotX(slot), SHELF_Y[shelf] ?? SHELF_Y[0], 0.05];
}

/** How much lift the top shelf gets, where there is no plank to hit. */
export const OPEN_LIFT = 0.42;

/**
 * The clear air over a shelf: from its surface to the lowest thing above it,
 * which is the strip light rather than the plank. `null` on the top shelf,
 * which has open air over it.
 */
export function shelfGap(shelf: number): number | null {
  const here = SHELF_Y[shelf] ?? SHELF_Y[0];
  const above = SHELF_Y[shelf - 1];
  if (above === undefined) return null;
  return above - STRIP_DROP - here;
}
