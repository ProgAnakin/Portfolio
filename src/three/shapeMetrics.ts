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

/** Hit area for a product's button, in CSS pixels at unit scale. */
export function productHitSize(project: Project): [number, number] {
  const h = shapeHeight[project.shape] * PRODUCT_SCALE;
  return [Math.max(70, h * 150), Math.max(70, h * 180)];
}
