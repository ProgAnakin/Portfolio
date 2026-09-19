import { palette } from './tokens';
import { SHELF_Y } from './ShelfRig';
import { STOCK, stockX } from './shelfStock';

/**
 * Backstock.
 *
 * Plain, unbranded, unlit boxes filling the gaps — no labels, no hover, no hit
 * target, and plain boxes rather than rounded ones — cardboard has hard
 * edges, and eight of them rounded cost more geometry than every product in
 * the shop put together. They exist so the shelves look stocked and so the products that
 * *are* projects have something to stand out against. Where each one goes is
 * in `shelfStock`, because the drag clamp has to treat them as solid.
 */
export function ShelfDressing() {
  const board = palette.oak700();

  return (
    <group>
      {STOCK.map((box, i) => (
        <mesh
          key={i}
          position={[stockX(box), (SHELF_Y[box.shelf] ?? 0) + box.h / 2, -0.1]}
          rotation={[0, box.rot, 0]}
        >
          <boxGeometry args={[box.w, box.h, box.d]} />
          <meshStandardMaterial color={board} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}
