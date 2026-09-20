import { projects } from './projects';

/**
 * Where the inventory goes on the fixture.
 *
 * Adding a project used to mean picking a shelf and a slot by hand, checking
 * nothing already stood there, and moving a filler box out of the way. Three
 * manual steps, all of them silent when you got them wrong — and the shelf
 * held six products before anything told you, which is not much of a runway
 * for a portfolio that is supposed to grow.
 *
 * So the fixture sizes itself to the inventory instead. Position comes from
 * order in `projects`, the gondola widens when a row fills up, and the
 * backstock fills whatever is left. Adding a project is adding one object.
 *
 * This lives in the data layer rather than in `three/` because the drawn shop,
 * the store directory and the 3D room all need the same answer, and only one
 * of them is allowed to know what a metre is.
 */
export const SHELVES = 3;

/**
 * Past four across, the gondola is wider than the room can frame and every
 * product on it is too small to read. Twelve projects is the point where this
 * design needs a second fixture rather than a bigger one — which is a real
 * design decision to take then, not a number to quietly exceed now.
 */
export const MAX_SLOTS_PER_SHELF = 4;

export const SLOTS_PER_SHELF = Math.max(
  2,
  Math.min(MAX_SLOTS_PER_SHELF, Math.ceil(projects.length / SHELVES)),
);

export const CAPACITY = SHELVES * SLOTS_PER_SHELF;

export interface Slot {
  shelf: number;
  slot: number;
}

/** Reading order: left to right along the top shelf, then down. */
export function shelfSlot(index: number): Slot {
  return {
    shelf: Math.floor(index / SLOTS_PER_SHELF),
    slot: index % SLOTS_PER_SHELF,
  };
}

const placed = new Map<string, Slot>(projects.map((project, i) => [project.id, shelfSlot(i)]));

export function slotFor(id: string): Slot {
  return placed.get(id) ?? { shelf: 0, slot: 0 };
}

/** Every position on the fixture with no project standing in it. */
export function freeSlots(): Slot[] {
  const taken = new Set([...placed.values()].map((s) => `${s.shelf}:${s.slot}`));
  const free: Slot[] = [];
  for (let shelf = 0; shelf < SHELVES; shelf += 1) {
    for (let slot = 0; slot < SLOTS_PER_SHELF; slot += 1) {
      if (!taken.has(`${shelf}:${slot}`)) free.push({ shelf, slot });
    }
  }
  return free;
}

// The one failure this layout can still have is running out of fixture, and
// it would show up as products stacked on each other rather than as an error.
// Say so, loudly, in development, where there is someone to hear it.
if (import.meta.env.DEV && projects.length > SHELVES * MAX_SLOTS_PER_SHELF) {
  console.warn(
    `[shop] ${projects.length} projects but the fixture holds ${SHELVES * MAX_SLOTS_PER_SHELF}. ` +
      'Add a second gondola, or cut the weakest project — the shelf will not do it for you.',
  );
}
