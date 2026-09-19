import { palette } from './tokens';
import { SHELF_DEPTH as DEPTH, SHELF_HALF_WIDTH, SHELF_X, SHELF_Y } from './shelfLayout';

export { SHELF_X, SHELF_HALF_WIDTH, SHELF_Y, SLOT_GAP, placement } from './shelfLayout';

/** Half the thickness of an upright. The planks land inside this. */
const POST = 0.075;

/**
 * The gondola unit: back panel, uprights, planks, and the strip tucked under
 * each lip. The strips are emissive geometry rather than invisible lights, so
 * the fixture you can see is the fixture doing the lighting.
 *
 * Every joint here is built so that no two surfaces are ever coplanar. The
 * planks used to run the full width of the unit and stop *exactly* at the
 * uprights, with the same depth — which put two faces on the same plane at
 * every corner and left the depth buffer to pick a winner per pixel. That is
 * the stepped, torn seam that used to run down the end of each shelf. Now the
 * planks finish a little way inside the uprights, the uprights stand proud in
 * front of them, the strips bury their end caps in the same timber, and the
 * back panel sits behind all of it. Nothing to arbitrate, nothing to flicker.
 *
 * Nothing here is a rounded box. A twelve-millimetre bevel on a four-metre
 * plank is seven hundred triangles that resolve to no pixels; the rounding
 * budget belongs to the objects whose silhouette depends on it.
 *
 * The back panel is opaque on purpose — it is what crops the oversized type
 * behind the canvas, which is how the DOM layer and the room end up in the
 * same space instead of stacked on each other.
 */
export function ShelfRig() {
  const oak = palette.oak500();
  const oakDark = palette.oak700();
  // Not quite the ink token: against a pale tiled wall a warm near-black back
  // panel reads as a hole cut in the room. Cooling it by a few degrees puts
  // the fixture in the same building as the tile behind it.
  const back = '#1e262b';
  const amber = palette.amber300();

  return (
    <group position={[SHELF_X, 0, 0]}>
      <mesh position={[0, 1.68, -DEPTH / 2 - 0.02]}>
        <planeGeometry args={[(SHELF_HALF_WIDTH + POST) * 2, 3.36]} />
        <meshStandardMaterial color={back} roughness={0.98} />
      </mesh>

      {/* Uprights, a shade deeper than the shelves so their front face is the
          one you see at every corner. */}
      {[-SHELF_HALF_WIDTH, SHELF_HALF_WIDTH].map((x) => (
        <mesh key={x} position={[x, 1.68, 0]}>
          <boxGeometry args={[POST * 2, 3.36, DEPTH + 0.03]} />
          <meshStandardMaterial color={oakDark} roughness={0.82} />
        </mesh>
      ))}

      {SHELF_Y.map((y, i) => (
        <group key={y}>
          {/* Finishes 3cm inside each upright: the end grain is buried in the
              post rather than fighting its face for the same pixels. */}
          <mesh position={[0, y - 0.035, 0]}>
            <boxGeometry args={[(SHELF_HALF_WIDTH - POST * 0.6) * 2, 0.07, DEPTH]} />
            <meshStandardMaterial color={oak} roughness={0.74} />
          </mesh>

          {/* Runs the whole width so both end caps finish inside the uprights.
              A strip that stops short shows two lit rectangles on end. */}
          <mesh position={[0, y - 0.082, DEPTH / 2 - 0.05]}>
            <boxGeometry args={[SHELF_HALF_WIDTH * 2, 0.016, 0.045]} />
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
