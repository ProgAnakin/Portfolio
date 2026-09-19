import { useEffect, useState } from 'react';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace, type Texture } from 'three';

/**
 * The floor, and the skirting where the wall lands on it.
 *
 * It was one near-black plane, which left the bottom third of every frame as
 * an unexplained void — the counter and the fixture simply stopped. This is
 * still dark, because the headline is printed over it and the stock has to
 * stay the brightest thing in the room, but it is dark *tile*: a grid that
 * recedes, a little terrazzo grit, and enough metalness for the shelf strips
 * to smear across it through the environment. That smear is what says the
 * floor is wet-mopped and lit from above rather than switched off.
 */
function paintTiles(): Texture | null {
  if (typeof document === 'undefined') return null;
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#0a0c0d';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#141719';
  ctx.fillRect(3, 3, size - 6, size - 6);

  // Grit. Warm, because everything that lights this room is.
  for (let i = 0; i < 120; i += 1) {
    const n = Math.sin(i * 17.3) * 43758.5453;
    const a = n - Math.floor(n);
    const m = Math.sin(i * 91.7) * 24634.6345;
    const b = m - Math.floor(m);
    ctx.fillStyle = i % 5 === 0 ? 'rgba(210, 176, 130, 0.12)' : 'rgba(150, 160, 168, 0.08)';
    ctx.beginPath();
    ctx.arc(6 + a * (size - 12), 6 + b * (size - 12), 0.7 + b * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(26, 8);
  texture.anisotropy = 16;
  return texture;
}

export function Floor() {
  const [tiles, setTiles] = useState<Texture | null>(null);

  useEffect(() => {
    const made = paintTiles();
    setTiles(made);
    return () => made?.dispose();
  }, []);

  return (
    <group>
      <mesh position={[0, 0, 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 8]} />
        {tiles ? (
          <meshStandardMaterial
            key={tiles.uuid}
            map={tiles}
            roughness={0.44}
            metalness={0.32}
            envMapIntensity={1.15}
          />
        ) : (
          <meshStandardMaterial key="bare" color="#121517" roughness={0.44} metalness={0.3} />
        )}
      </mesh>

      {/* Skirting. The wall used to run down into the dark and stop; with the
          coving at the top, this is the other end of the same sentence. */}
      <mesh position={[0.3, 0.085, -1.845]}>
        <boxGeometry args={[22, 0.17, 0.09]} />
        <meshStandardMaterial color="#8b8478" roughness={0.84} />
      </mesh>
      {/* And the shadow it casts into the corner, which no light in here would
          otherwise put there. */}
      <mesh position={[0.3, 0.26, -1.86]}>
        <planeGeometry args={[22, 0.34]} />
        <meshBasicMaterial color="#05070a" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
