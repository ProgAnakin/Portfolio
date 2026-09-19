import { RoundedBox } from '@react-three/drei';
import { palette } from './tokens';
import { SHELF_DEPTH as DEPTH, SHELF_HALF_WIDTH, SHELF_X, SHELF_Y } from './shelfLayout';

export { SHELF_X, SHELF_HALF_WIDTH, SHELF_Y, SLOT_GAP, placement } from './shelfLayout';

/**
 * The gondola unit: back panel, uprights, planks, and the strip tucked under
 * each lip. The strips are emissive geometry rather than invisible lights, so
 * the fixture you can see is the fixture doing the lighting.
 *
 * The back panel is opaque on purpose — it is what crops the oversized type
 * behind the canvas, which is how the DOM layer and the room end up in the
 * same space instead of stacked on each other.
 */
export function ShelfRig() {
  const oak = palette.oak500();
  const oakDark = palette.oak700();
  // Not quite the ink token: against a petrol wall a warm near-black back
  // panel reads as a hole cut in the room. Cooling it by a few degrees puts
  // the fixture in the same building as the tile behind it.
  const back = '#1a2429';
  const amber = palette.amber300();

  return (
    <group position={[SHELF_X, 0, 0]}>
      <mesh position={[0, 1.68, -DEPTH / 2]}>
        <planeGeometry args={[SHELF_HALF_WIDTH * 2, 3.36]} />
        <meshStandardMaterial color={back} roughness={0.98} />
      </mesh>

      {[-SHELF_HALF_WIDTH, SHELF_HALF_WIDTH].map((x) => (
        <RoundedBox
          key={x}
          args={[0.13, 3.36, DEPTH]}
          radius={0.02}
          smoothness={2}
          position={[x, 1.68, 0]}
        >
          <meshStandardMaterial color={oakDark} roughness={0.82} />
        </RoundedBox>
      ))}

      {SHELF_Y.map((y, i) => (
        <group key={y}>
          <RoundedBox
            args={[SHELF_HALF_WIDTH * 2, 0.07, DEPTH]}
            radius={0.012}
            smoothness={2}
            position={[0, y - 0.035, 0]}
          >
            <meshStandardMaterial color={oak} roughness={0.74} />
          </RoundedBox>

          <mesh position={[0, y - 0.082, DEPTH / 2 - 0.05]}>
            <boxGeometry args={[SHELF_HALF_WIDTH * 2 - 0.26, 0.016, 0.045]} />
            <meshStandardMaterial
              color={amber}
              emissive={amber}
              emissiveIntensity={i === 0 ? 2.6 : 2.3}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** The floor the whole room stands on. */
export function Floor() {
  return (
    <mesh position={[0, 0, 1]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[26, 8]} />
      <meshStandardMaterial color={palette.ink900()} roughness={0.42} metalness={0.22} />
    </mesh>
  );
}
