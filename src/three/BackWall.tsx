import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, CanvasTexture, SRGBColorSpace, type Texture } from 'three';
import { palette } from './tokens';

/**
 * The back wall: glazed tile, lit by the room.
 *
 * The shop used to have its own name painted across here, which made the one
 * surface with nothing on it compete with the three things that matter. This
 * says nothing and does more work: petrol-blue tile is a cold ground for a
 * warm room, so the amber strips finally have something to be warm *against*,
 * and the glaze picks up the pendant as a pool of light instead of a flat
 * shade of brown.
 *
 * Every mark is drawn here rather than downloaded — the courses, the glaze,
 * the spill under the pendant and the cold wash from the street.
 */

/** The darkest the room gets: grout, and the fog at the far end of it. */
export const WALL_DEEP = '#08202b';

const COL = 34;
const ROW = 22;
const GROUT = 3;

/** Deterministic noise, so a reload paints the same wall twice. */
function jitter(i: number, j: number): number {
  const n = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

async function paintTiles(width: number, height: number): Promise<Texture | null> {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const tw = width / COL;
  const th = height / ROW;

  // Grout, which is just the wall showing through between the tiles.
  ctx.fillStyle = WALL_DEEP;
  ctx.fillRect(0, 0, width, height);

  for (let row = 0; row < ROW; row += 1) {
    // Brick bond: every other course steps half a tile, and runs one tile
    // wider so the stagger never leaves a seam down the edge.
    const offset = row % 2 === 0 ? 0 : -tw / 2;
    for (let col = -1; col <= COL; col += 1) {
      const x = col * tw + offset;
      const y = row * th;
      const n = jitter(col, row);
      const m = jitter(row, col);

      // Glaze is never even. Lightness and hue both drift a little per tile.
      const light = 17 + n * 8;
      const hue = 193 + (m - 0.5) * 9;
      ctx.fillStyle = `hsl(${hue} 56% ${light}%)`;
      ctx.fillRect(x + GROUT / 2, y + GROUT / 2, tw - GROUT, th - GROUT);

      // The fired highlight, top-left, where the light would catch it.
      const glaze = ctx.createLinearGradient(x, y, x + tw * 0.8, y + th);
      glaze.addColorStop(0, `rgba(196, 236, 248, ${0.07 + n * 0.07})`);
      glaze.addColorStop(0.55, 'rgba(196, 236, 248, 0)');
      ctx.fillStyle = glaze;
      ctx.fillRect(x + GROUT / 2, y + GROUT / 2, tw - GROUT, th - GROUT);

      // One tile in twelve is a duller firing. Hand-glazed tile is not a grid
      // of identical squares, and the eye notices when it is.
      if (m > 0.84) {
        ctx.fillStyle = `rgba(6, 22, 29, ${0.24 + n * 0.2})`;
        ctx.fillRect(x + GROUT / 2, y + GROUT / 2, tw - GROUT, th - GROUT);
      }
    }
  }

  // The pendant, pooling on the tiles behind the counter.
  const pool = ctx.createRadialGradient(
    width * 0.59, height * 0.42, 10,
    width * 0.59, height * 0.42, width * 0.28,
  );
  pool.addColorStop(0, 'rgba(242, 192, 120, 0.16)');
  pool.addColorStop(1, 'rgba(242, 192, 120, 0)');
  ctx.fillStyle = pool;
  ctx.fillRect(0, 0, width, height);

  // The street, coming in cold from the left.
  const street = ctx.createRadialGradient(
    -width * 0.05, height * 0.2, 10,
    -width * 0.05, height * 0.2, width * 0.42,
  );
  street.addColorStop(0, 'rgba(126, 196, 226, 0.3)');
  street.addColorStop(1, 'rgba(120, 178, 208, 0)');
  ctx.fillStyle = street;
  ctx.fillRect(0, 0, width, height);

  // Corners down, so the room ends rather than stopping.
  const vignette = ctx.createRadialGradient(
    width / 2, height * 0.5, height * 0.14,
    width / 2, height * 0.5, width * 0.56,
  );
  vignette.addColorStop(0, 'rgba(4, 14, 19, 0)');
  vignette.addColorStop(1, 'rgba(4, 14, 19, 0.92)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/**
 * A neon tube: the lit glass, and the haze around it.
 *
 * There is no bloom pass in this scene — a full-screen filter would cost more
 * than the whole room — so the halo is a second, fatter copy of the tube added
 * onto whatever is behind it. Close enough at this distance, and it survives
 * on the machines that get the cheaper tier.
 */
function Neon({
  position,
  rotation = [0, 0, 0],
  arc,
  length = 1,
  color,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  arc?: number;
  length?: number;
  color: string;
}) {
  const glass = useRef<{ material: { opacity: number } } | null>(null);
  const flickerAt = useRef(0);

  // A tube that never wavers reads as a stripe of paint. This one has a
  // barely-there breath, and once in a while the gas stutters.
  useFrame(({ clock }) => {
    if (!glass.current) return;
    const t = clock.elapsedTime;
    if (t > flickerAt.current) flickerAt.current = t + 5 + Math.random() * 11;
    const stutter = flickerAt.current - t < 0.16 ? 0.55 : 1;
    glass.current.material.opacity = (0.3 + Math.sin(t * 1.4) * 0.025) * stutter;
  });

  const geometry = arc ? (
    <torusGeometry args={[length, 0.026, 10, 90, arc]} />
  ) : (
    <cylinderGeometry args={[0.026, 0.026, length, 12]} />
  );
  const halo = arc ? (
    <torusGeometry args={[length, 0.1, 10, 60, arc]} />
  ) : (
    <cylinderGeometry args={[0.1, 0.1, length, 12]} />
  );

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        {geometry}
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh ref={glass as never}>
        {halo}
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export function BackWall() {
  const [texture, setTexture] = useState<Texture | null>(null);
  const accent = useMemo(() => palette.accent(), []);

  useEffect(() => {
    let alive = true;
    let made: Texture | null = null;
    paintTiles(2048, 1024).then((t) => {
      made = t;
      if (alive) setTexture(t);
      else t?.dispose();
    });
    return () => {
      alive = false;
      made?.dispose();
    };
  }, []);

  return (
    <group>
      <mesh position={[0.3, 2.0, -1.9]}>
        <planeGeometry args={[16, 6.4]} />
        {/* The key matters: without it React reconciles the two materials as
            one element and only assigns the new props, so three never
            recompiles the shader, the map sampler is never added, and the wall
            renders as a flat slab. Keying on the texture builds a fresh
            material once the artwork exists.

            The emissive map is the same artwork at a third strength, which is
            what keeps the tile *blue*. Everything lighting this room is amber;
            lit alone, a dark blue wall comes back olive. Letting the glaze put
            back a little of its own colour is the difference between a petrol
            wall and a khaki one. */}
        {texture ? (
          <meshStandardMaterial
            key={texture.uuid}
            map={texture}
            emissiveMap={texture}
            emissive="#ffffff"
            emissiveIntensity={0.34}
            roughness={0.5}
            metalness={0.05}
            envMapIntensity={0.45}
          />
        ) : (
          <meshStandardMaterial key="unglazed" color="#0d2b38" roughness={0.6} />
        )}
      </mesh>

      <NeonRun color={accent} />

      {/* What the tubes actually do to the room. Short reach, so the neon
          colours the wall and the top of the fixture without reaching the
          stock, which has its own light. */}
      <pointLight position={[-4.6, 2.2, -1.2]} intensity={8} distance={5.6} decay={2} color={accent} />
      <pointLight position={[0.6, 3.5, -1.1]} intensity={5} distance={4.8} decay={2} color={accent} />
    </group>
  );
}

/**
 * The neon: one continuous run, not three ornaments.
 *
 * It traces the architecture rather than decorating it — along the ceiling
 * line, round a corner, and down the left-hand return — which is what a real
 * shop fit-out does with a length of tube and why it reads as deliberate. The
 * corner is the whole trick: an arc that meets both straights exactly turns
 * two stripes into one drawn line.
 */
function NeonRun({ color }: { color: string }) {
  const TOP = 3.62;
  const LEFT = -5.15;
  const R = 0.5;

  return (
    <group position={[0, 0, -1.78]}>
      {/* Along the ceiling line, behind everything in the room. */}
      <Neon
        position={[(LEFT + R + 6.9) / 2, TOP, 0]}
        rotation={[0, 0, Math.PI / 2]}
        length={6.9 - (LEFT + R)}
        color={color}
      />
      {/* The corner. A torus arc always starts at 0, so the quarter is turned
          into place rather than started late. */}
      <Neon
        position={[LEFT + R, TOP - R, 0]}
        rotation={[0, 0, Math.PI / 2]}
        arc={Math.PI / 2}
        length={R}
        color={color}
      />
      {/* And down the return. */}
      <Neon
        position={[LEFT, (TOP - R + 0.2) / 2, 0]}
        length={TOP - R - 0.2}
        color={color}
      />
    </group>
  );
}
