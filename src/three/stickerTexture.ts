import { CanvasTexture, SRGBColorSpace, type Texture } from 'three';
import type { Project } from '../data/projects';

const S = 384;

const COPY: Record<string, { top: string; bottom: string }> = {
  'out-of-stock': { top: 'IN', bottom: 'PROGRESS' },
  restocking: { top: 'ON', bottom: 'THE WAY' },
  'in-stock': { top: 'IN', bottom: 'STOCK' },
};

/**
 * The sticker slapped on a box that is not finished.
 *
 * A roundel, printed slightly off-register and rotated by hand, because that
 * is what a sticker applied in a back room looks like. It carries the status
 * on the object itself, which is where a customer reads it — the packaging
 * already says what the thing is, so nothing else has to repeat it.
 */
export async function createStickerTexture(project: Project): Promise<Texture | null> {
  if (typeof document === 'undefined') return null;
  try {
    await document.fonts.ready;
  } catch {
    /* draw with whatever is loaded */
  }

  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const copy = COPY[project.status] ?? COPY['out-of-stock'];
  const ink = '#2a1207';
  const paper = '#fdf3e2';
  const alert = project.brand.accent;

  ctx.clearRect(0, 0, S, S);
  const c = S / 2;

  // Scalloped edge, the way a printed roundel is die-cut.
  ctx.fillStyle = paper;
  ctx.beginPath();
  for (let i = 0; i <= 96; i += 1) {
    const a = (i / 96) * Math.PI * 2;
    const wobble = 1 + Math.sin(a * 18) * 0.035;
    const r = c * 0.94 * wobble;
    const x = c + Math.cos(a) * r;
    const y = c + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // Off-register colour block — the printing mistake that makes it feel real.
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = alert;
  ctx.beginPath();
  ctx.arc(c + 7, c - 6, c * 0.9, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = alert;
  ctx.lineWidth = 17;
  ctx.beginPath();
  ctx.arc(c, c, c * 0.79, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(c, c, c * 0.68, 0, Math.PI * 2);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = ink;
  ctx.font = '800 62px "Bricolage Grotesque", sans-serif';
  ctx.fillText(copy.top, c, c - 14);

  let size = 56;
  ctx.font = `800 ${size}px "Bricolage Grotesque", sans-serif`;
  while (ctx.measureText(copy.bottom).width > S * 0.66 && size > 22) {
    size -= 2;
    ctx.font = `800 ${size}px "Bricolage Grotesque", sans-serif`;
  }
  ctx.fillStyle = alert;
  ctx.fillText(copy.bottom, c, c + size * 0.86);

  ctx.fillStyle = ink;
  ctx.font = '400 20px "Space Mono", monospace';
  ctx.letterSpacing = '4px';
  ctx.globalAlpha = 0.55;
  ctx.fillText('ANNICHINI & CO.', c, c + S * 0.29);
  ctx.globalAlpha = 1;

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
