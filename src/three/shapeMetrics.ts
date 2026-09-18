import type { Project, ProductShape } from '../data/projects';

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
