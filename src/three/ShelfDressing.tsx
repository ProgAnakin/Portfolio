import { palette } from './tokens';
import { SHELF_Y } from './ShelfRig';
import { backstock } from './shelfStock';

/**
 * Backstock.
 *
 * Plain, unbranded, unlit boxes filling the gaps — no labels, no hover, no hit
 * target, and plain boxes rather than rounded ones, because cardboard has hard
 * edges and eight of them rounded cost more geometry than every product in the
 * shop put together. Where each one goes is worked out in `shelfStock` from
 * the slots the inventory did not take.
 */
export function ShelfDressing() {
  const board = palette.oak700();
  const boxes = backstock();

  return (
    <group>
      {boxes.map((box, i) => (
        <mesh
          key={i}
          position={[box.x, (SHELF_Y[box.shelf] ?? 0) + box.h / 2, -0.1]}
          rotation={[0, box.rot, 0]}
        >
          <boxGeometry args={[box.w, box.h, box.d]} />
          <meshStandardMaterial color={board} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}
