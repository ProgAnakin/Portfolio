import { useEffect, useState } from 'react';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace, type Texture } from 'three';
import { palette } from './tokens';
import { SHELF_DEPTH as DEPTH, SHELF_HALF_WIDTH, SHELF_X, SHELF_Y } from './shelfLayout';

/**
 * The back panel is pegboard.
 *
 * It is the largest flat surface in the shot and the one every product is read
 * against, so it has to stay dark — but dark and *featureless* is a hole, and
 * a hole is what it was. Perforated board is what a real gondola is backed
 * with, the holes are almost subliminal at this size, and it costs one 128px
 * tile with nothing added to the geometry.
 */
function paintPegboard(): Texture | null {
  if (typeof document === 'undefined') return null;
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#1f272c';
  ctx.fillRect(0, 0, size, size);
  // A board is made of boards: one seam per tile, barely there.
  ctx.fillStyle = 'rgba(12, 16, 19, 0.55)';
  ctx.fillRect(0, 0, size, 2);

  for (let y = 16; y < size; y += 32) {
    for (let x = 16; x < size; x += 32) {
      ctx.fillStyle = 'rgba(8, 11, 13, 0.85)';
      ctx.beginPath();
      ctx.arc(x, y, 3.4, 0, Math.PI * 2);
      ctx.fill();
      // The lip the light catches on the underside of each hole.
      ctx.fillStyle = 'rgba(158, 174, 184, 0.2)';
      ctx.beginPath();
      ctx.arc(x, y + 1.4, 3.4, Math.PI, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(22, 17);
  texture.anisotropy = 8;
  return texture;
}

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
  const [board, setBoard] = useState<Texture | null>(null);

  useEffect(() => {
    const made = paintPegboard();
    setBoard(made);
    return () => made?.dispose();
  }, []);

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
        {/* Lit by its own map, at a fraction. Every practical in this shop
            points down and away from this panel, so lit honestly it is black —
            and a black rectangle behind the stock is a hole, not a fixture.
            The holes in the board stay black either way, which is the only
            part that has to read. */}
        {board ? (
          <meshStandardMaterial
            key={board.uuid}
            map={board}
            emissiveMap={board}
            emissive="#ffffff"
            emissiveIntensity={0.7}
            roughness={0.96}
          />
        ) : (
          <meshStandardMaterial key="plain" color={back} roughness={0.98} />
        )}
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
