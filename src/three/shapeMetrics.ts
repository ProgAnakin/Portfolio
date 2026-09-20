import { projects, type Project, type ProductShape } from '../data/projects';
import { slotFor } from '../data/shelving';
import { OPEN_LIFT, SHELF_HALF_WIDTH, SHELF_X, shelfGap, SLOT_GAP, slotX } from './shelfLayout';
import { backstock } from './shelfStock';

/**
 * Sizes, with no three.js in sight.
 *
 * The DOM control layer needs to know how big a product is, but importing that
 * from a module that touches three.js drags the whole 3D stack into the entry
 * bundle — which is exactly what devices that never load the room must not
 * download. Keeping the numbers here keeps the split honest.
 */

/**
 * How tall each shape stands, so nothing looms over its neighbour.
 *
 * This is the *drawn* top of the object, flaps, lids and crooked stickers
 * included — not the top of its main box. Understating it is how a lift ends
 * with a product's lid through the plank above, because the headroom below is
 * worked out from these numbers and nothing else. Change a shape, change this.
 */
export const shapeHeight: Record<ProductShape, number> = {
  kiosk: 0.9,
  'boxed-set': 0.66,
  crate: 0.4,
  tin: 0.5,
  carton: 0.64,
};

/** Stock is drawn 40% up from life so a label reads from the doorway. */
export const PRODUCT_SCALE = 1.4;

/**
 * The tallest a product ever gets while being squashed.
 *
 * Picking something up stretches it a few percent, and the headroom below is
 * worked out against this rather than against the resting height — otherwise
 * the stretch at the top of a drag is exactly what puts a lid through a plank.
 * `ProductObject` clamps to the same number, so the two cannot drift apart.
 */
export const SQUASH_CEILING = 1.07;
export const SQUASH_FLOOR = 0.93;

/**
 * How far a product rolls as it is pulled sideways, and the most it ever does.
 *
 * A roll costs headroom — the outer corner of a box tipped by a tenth of a
 * radian is measurably higher than the box was — so the numbers live here
 * beside the limits that have to pay for it, and `ProductObject` reads them
 * rather than keeping a second copy.
 */
export const ROLL_PER_SIDE = 0.2;
export const ROLL_CAP = 0.16;

/**
 * How wide the *body* of each shape is: the part a pointer aims at. Needed
 * because a tall thing is not a wide thing — sizing both axes off the height
 * is what once made the kiosk's hit area swallow the box beside it.
 */
export const shapeWidth: Record<ProductShape, number> = {
  kiosk: 0.5,
  'boxed-set': 0.52,
  crate: 0.52,
  tin: 0.4,
  carton: 0.34,
};

/**
 * How far each shape actually reaches to its left and to its right.
 *
 * Separate from `shapeWidth` because the two answer different questions. A
 * button wants the body; a collision wants the props — the kiosk's swipe card
 * hangs off its right-hand side and the boxed set's ball sits out in front of
 * it, and those are the parts that arrive in the next slot first. Neither
 * shape is symmetrical, so neither gets a single number.
 */
export const shapeReach: Record<ProductShape, [left: number, right: number]> = {
  kiosk: [0.25, 0.32],
  'boxed-set': [0.27, 0.39],
  crate: [0.43, 0.43],
  tin: [0.21, 0.21],
  carton: [0.26, 0.26],
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

/** What stands in the next slot along, if anything does. */
function neighbour(project: Project, direction: -1 | 1): Project | undefined {
  const here = slotFor(project.id);
  return projects.find((p) => {
    const there = slotFor(p.id);
    return there.shelf === here.shelf && there.slot === here.slot + direction;
  });
}

/**
 * How far a product may slide toward its neighbour before the two touch.
 *
 * Measured against where the neighbour is *standing*, not against where it
 * could be dragged to, because only one product is ever being dragged: the
 * input layer hands out a single pointer. An empty slot is worth half a slot
 * of travel — enough to feel loose, not so much that a box ends up parked
 * where the next product will go.
 */
function sideRoom(project: Project, direction: -1 | 1): number {
  const scale = PRODUCT_SCALE * SQUASH_WIDEN;
  const mine = shapeReach[project.shape][direction < 0 ? 0 : 1] * scale;

  const other = neighbour(project, direction);
  const free = other
    ? SLOT_GAP - mine - shapeReach[other.shape][direction < 0 ? 1 : 0] * scale - GAP_PAD
    : SLOT_GAP / 2;

  // Never off the end of the plank, and never into the backstock — those
  // boxes are scenery, but they are scenery that does not get out of the way.
  const here = slotFor(project.id);
  const centre = slotX(here.slot);
  const edge =
    direction < 0
      ? centre - (SHELF_X - SHELF_HALF_WIDTH + mine)
      : SHELF_X + SHELF_HALF_WIDTH - mine - centre;

  const leading = centre + direction * mine;
  let stock = Infinity;
  for (const box of backstock()) {
    if (box.shelf !== here.shelf) continue;
    const face = box.x - (direction * box.w) / 2;
    const room = (face - leading) * direction;
    if (room >= 0) stock = Math.min(stock, room - GAP_PAD);
  }

  return Math.max(0, Math.min(free, edge, stock));
}

/** Squash widens a product by a few percent at the extremes. Leave for it. */
const SQUASH_WIDEN = 1.08;

/** A finger's width of air kept between two products that both exist. */
const GAP_PAD = 0.06;

export function productLimits(project: Project): DragLimits {
  // Worst case, not resting case: the product at full stretch.
  const height = shapeHeight[project.shape] * PRODUCT_SCALE * SQUASH_CEILING;
  const side = Math.min(sideRoom(project, -1), sideRoom(project, 1));

  // A product pulled to the end of its travel is also rolled, and the corner
  // that rolls upward is the one that meets the shelf above. Pay for it here
  // rather than discovering it as a flap through a plank.
  const reach = Math.max(...shapeReach[project.shape]) * PRODUCT_SCALE;
  const roll = reach * Math.sin(Math.min(ROLL_CAP, side * ROLL_PER_SIDE));

  // Nothing overhead on the top shelf, so it gets a full lift. Below it, the
  // lift is whatever is left between the product's own head and the strip
  // light under the plank above.
  const gap = shelfGap(slotFor(project.id).shelf);
  const up = gap === null ? OPEN_LIFT : Math.max(0, gap - height - roll - 0.02);

  return {
    up,
    // A little sink into the shelf reads as weight. Any more is a box in wood.
    down: 0.03,
    side,
  };
}
