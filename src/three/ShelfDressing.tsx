import { RoundedBox } from '@react-three/drei';
import { palette } from './tokens';
import { SHELF_HALF_WIDTH, SHELF_X, SHELF_Y } from './ShelfRig';

/**
 * Backstock.
 *
 * Three products on three shelves reads as a shop going out of business. These
 * are plain, unbranded, unlit boxes filling the gaps — no labels, no hover, no
 * hit target. They exist so the shelves look stocked and so the products that
 * *are* projects have something to stand out against.
 */
const STOCK: { shelf: number; x: number; w: number; h: number; d: number; rot: number }[] = [
  { shelf: 0, x: 1.35, w: 0.34, h: 0.46, d: 0.3, rot: 0.06 },
  { shelf: 0, x: 1.72, w: 0.3, h: 0.4, d: 0.28, rot: -0.1 },
  { shelf: 1, x: 0.5, w: 0.4, h: 0.34, d: 0.34, rot: -0.04 },
  { shelf: 1, x: 1.3, w: 0.46, h: 0.5, d: 0.34, rot: 0.08 },
  { shelf: 1, x: 1.74, w: 0.28, h: 0.3, d: 0.26, rot: -0.14 },
  { shelf: 2, x: -1.5, w: 0.52, h: 0.28, d: 0.4, rot: 0.02 },
  { shelf: 2, x: -0.95, w: 0.44, h: 0.24, d: 0.36, rot: -0.06 },
  { shelf: 2, x: 1.5, w: 0.38, h: 0.42, d: 0.3, rot: 0.11 },
];

export function ShelfDressing() {
  const board = palette.oak700();

  return (
    <group position={[SHELF_X, 0, 0]}>
      {STOCK.map((box, i) => (
        <RoundedBox
          key={i}
          args={[box.w, box.h, box.d]}
          radius={0.012}
          smoothness={2}
          position={[
            Math.max(-SHELF_HALF_WIDTH + 0.4, Math.min(SHELF_HALF_WIDTH - 0.4, box.x)),
            (SHELF_Y[box.shelf] ?? 0) + box.h / 2,
            -0.1,
          ]}
          rotation={[0, box.rot, 0]}
        >
          <meshStandardMaterial color={board} roughness={0.95} />
        </RoundedBox>
      ))}
    </group>
  );
}
