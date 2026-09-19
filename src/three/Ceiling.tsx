import { useEffect, useState } from 'react';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace, type Texture } from 'three';

/** How high the room is, and where the pendant is screwed to. */
export const CEILING_Y = 4.0;

/**
 * The ceiling.
 *
 * The room had none: the pendant's flex ran up and simply stopped in mid-air,
 * which is the one thing that tells a viewer a room is a backdrop. Painting
 * the gap dark would have hidden the join without building the room, so this
 * is pressed tin — a real shop ceiling, and the right answer at this camera
 * angle because the coffers foreshorten into a rhythm across the top of the
 * frame instead of a flat field.
 *
 * It is lit by its own emissive map rather than by a lamp. Every practical in
 * this shop points down; a ceiling lit correctly from below would be black,
 * and adding an uplighter to fix it would cost arithmetic in every lit pixel
 * of the room to brighten a band at the top of it.
 */
function paintTin(): Texture | null {
  if (typeof document === 'undefined') return null;
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // The rail between coffers.
  ctx.fillStyle = '#6b6459';
  ctx.fillRect(0, 0, size, size);

  const inset = 22;
  const span = size - inset * 2;

  // The sunken panel, with the light coming from the front of the shop, so the
  // far lip catches and the near one falls away.
  const face = ctx.createLinearGradient(0, inset, 0, inset + span);
  face.addColorStop(0, '#9a9285');
  face.addColorStop(0.55, '#7c7568');
  face.addColorStop(1, '#5d574e');
  ctx.fillStyle = face;
  ctx.fillRect(inset, inset, span, span);

  // Bevel: two bright edges, two dark, which is the whole trick of stamped
  // metal and the only thing that survives this much foreshortening.
  ctx.strokeStyle = 'rgba(255, 248, 232, 0.42)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(inset, inset + span);
  ctx.lineTo(inset, inset);
  ctx.lineTo(inset + span, inset);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(24, 20, 16, 0.55)';
  ctx.beginPath();
  ctx.moveTo(inset + span, inset);
  ctx.lineTo(inset + span, inset + span);
  ctx.lineTo(inset, inset + span);
  ctx.stroke();

  // A raised rosette in the middle of each panel.
  const c = size / 2;
  ctx.save();
  ctx.translate(c, c);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = '#8b8376';
  ctx.fillRect(-26, -26, 52, 52);
  ctx.strokeStyle = 'rgba(255, 248, 232, 0.32)';
  ctx.lineWidth = 3;
  ctx.strokeRect(-26, -26, 52, 52);
  ctx.fillStyle = '#6f6a60';
  ctx.beginPath();
  ctx.arc(0, 0, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(26, 13);
  texture.anisotropy = 16;
  return texture;
}

export function Ceiling() {
  const [tin, setTin] = useState<Texture | null>(null);

  useEffect(() => {
    const made = paintTin();
    setTin(made);
    return () => made?.dispose();
  }, []);

  return (
    <group>
      <mesh position={[0.3, CEILING_Y, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 11]} />
        {tin ? (
          <meshStandardMaterial
            key={tin.uuid}
            map={tin}
            emissiveMap={tin}
            emissive="#8d8578"
            emissiveIntensity={0.34}
            roughness={0.86}
          />
        ) : (
          <meshStandardMaterial key="bare" color="#4f4a43" roughness={0.9} />
        )}
      </mesh>

      {/* Coving, so the wall stops at something instead of running out. */}
      <mesh position={[0.3, CEILING_Y - 0.08, -1.82]} rotation={[Math.PI / 4, 0, 0]}>
        <boxGeometry args={[22, 0.16, 0.16]} />
        <meshStandardMaterial color="#8b8478" roughness={0.82} />
      </mesh>
    </group>
  );
}
