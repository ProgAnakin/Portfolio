import type { Project, ProductShape } from '../data/projects';
import { OPEN_LIFT, shelfGap, SLOT_GAP } from './shelfLayout';

/**
 * Sizes, with no three.js in sight.
 *
 * The DOM control layer needs to know how big a product is, but importing that
 * from a module that touches three.js drags the whole 3D stack into the entry
 * bundle — which is exactly what devices that never load the room must not
 * download. Keeping the numbers here keeps the split honest.
 */

/** How tall each shape stands, so nothing looms over its neighbour. */
export const shapeHeight: Record<ProductShape, number> = {
  kiosk: 0.86,
  'boxed-set': 0.62,
  crate: 0.42,
  tin: 0.5,
  carton: 0.64,
};

/** Stock is drawn 40% up from life so a label reads from the doorway. */
export const PRODUCT_SCALE = 1.4;

/** How wide each shape is. Needed because a tall thing is not a wide thing. */
export const shapeWidth: Record<ProductShape, number> = {
  kiosk: 0.46,
  'boxed-set': 0.52,
  crate: 0.46,
  tin: 0.4,
  carton: 0.34,
};

/**
 * Hit area for a product's button.
 *
 * Both axes come from the object's own size, and the number is in the same
 * world units the projector scales by — so the button ends up the size of the
 * thing it sits on. Sizing both axes off the *height* is what previously made
 * a tall kiosk's hit area swallow the box beside it.
 */
export function productHitSize(project: Project): [number, number] {
  const w = shapeWidth[project.shape] * PRODUCT_SCALE;
  const h = shapeHeight[project.shape] * PRODUCT_SCALE;
  // A slightly generous target, but never wider than the gap between slots.
  return [Math.min(w * 118, 112), h * 104];
}

/**
 * How far a product may move before it breaks the scene.
 *
 * Picking something up is meant to look like picking something up, not like a
 * box passing through a plank. Both limits come from the geometry around the
 * product rather than from a constant that happened to look right on one
 * shelf: `up` is the clear air to the underside of the shelf above, `side` is
 * the gap to the next slot. Anything that would collide simply cannot be
 * reached.
 */
export interface DragLimits {
  up: number;
  down: number;
  side: number;
}

export function productLimits(project: Project): DragLimits {
  const height = shapeHeight[project.shape] * PRODUCT_SCALE;
  const width = shapeWidth[project.shape] * PRODUCT_SCALE;

  // Squash widens the product by a few percent at the extremes; leave for it.
  const halfWidth = (width * 1.08) / 2;

  // Nothing overhead on the top shelf, so it gets a full lift. Below it, the
  // lift is whatever is left between the product's own head and the plank.
  const gap = shelfGap(project.shelf);
  const up = gap === null ? OPEN_LIFT : Math.max(0, gap - height - 0.02);

  return {
    up,
    // A little sink into the shelf reads as weight. Any more is a box in wood.
    down: 0.03,
    side: Math.max(0, SLOT_GAP / 2 - halfWidth),
  };
}
