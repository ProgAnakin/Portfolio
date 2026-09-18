import { useEffect, useState } from 'react';
import { CanvasTexture, SRGBColorSpace, type Texture } from 'three';
import { profile } from '../data/profile';
import { palette } from './tokens';

/**
 * The back wall, with the shop name painted on it at the size signage
 * actually is.
 *
 * This is the type-as-architecture move, and it belongs in the room rather
 * than in a DOM layer behind a transparent canvas: painted on the wall it
 * gets lit by the shelves, occluded by the stock, and cropped by whatever is
 * standing in front of it. Decorative, so the readable version of every word
 * here lives in the DOM elsewhere.
 */
async function paintWall(width: number, height: number): Promise<Texture | null> {
  if (typeof document === 'undefined') return null;
  try {
    await document.fonts.ready;
  } catch {
    /* draw with whatever is loaded */
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = palette.ink800();
  ctx.fillRect(0, 0, width, height);

  // Painted-on, not printed: a shade off the wall, never a highlight.
  ctx.fillStyle = palette.oak700();
  ctx.textAlign = 'center';

  let size = 320;
  ctx.font = `800 ${size}px "Bricolage Grotesque", sans-serif`;
  const name = profile.shopName;
  while (ctx.measureText(name).width > width * 0.92 && size > 80) {
    size -= 8;
    ctx.font = `800 ${size}px "Bricolage Grotesque", sans-serif`;
  }
  ctx.fillText(name, width / 2, height * 0.46);

  ctx.font = '400 54px "Space Mono", monospace';
  ctx.letterSpacing = '26px';
  ctx.fillStyle = palette.oak700();
  ctx.fillText('SALES · PRODUCT · RETAIL', width / 2, height * 0.58);

  // A ghost of whatever the sign painter did before.
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = palette.oak700();
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(width * 0.08, height * 0.66);
  ctx.lineTo(width * 0.92, height * 0.66);
  ctx.stroke();
  ctx.globalAlpha = 1;

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function WallSign() {
  const [texture, setTexture] = useState<Texture | null>(null);

  useEffect(() => {
    let alive = true;
    let made: Texture | null = null;
    paintWall(2048, 768).then((t) => {
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
    <mesh position={[0.3, 2.0, -1.9]}>
      <planeGeometry args={[15, 5.6]} />
      {/* The key matters: without it React reconciles the two materials as one
          element and only assigns the new props, so three never recompiles the
          shader — the map and emissiveMap samplers are never added and the bare
          white `emissive` renders as a flat grey wall. Keying on the texture
          builds a fresh material once the artwork exists. */}
      {texture ? (
        <meshStandardMaterial
          key={texture.uuid}
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={0.5}
          roughness={0.98}
        />
      ) : (
        <meshStandardMaterial key="unpainted" color={palette.ink800()} roughness={0.98} />
      )}
    </mesh>
  );
}
