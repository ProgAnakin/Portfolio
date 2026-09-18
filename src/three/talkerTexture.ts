import { CanvasTexture, SRGBColorSpace, type Texture } from 'three';
import type { Project } from '../data/projects';
import { palette } from './tokens';

const W = 512;
const H = 160;

/**
 * The shelf talker — the little card clipped to the shelf lip under a product.
 *
 * This is the piece of retail furniture that turns a row of objects into a
 * display: it names the thing, prices it, and shouts when something is out of
 * stock. Without it a shelf reads as storage.
 */
export async function createTalkerTexture(project: Project): Promise<Texture | null> {
  if (typeof document === 'undefined') return null;
  try {
    await document.fonts.ready;
  } catch {
    /* draw with whatever is loaded */
  }

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const soldOut = project.status === 'out-of-stock';
  const paper = palette.paper100();
  const ink = palette.ink900();
  const accent = palette.accent();

  ctx.fillStyle = soldOut ? '#2a1512' : paper;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = soldOut ? accent : ink;
  ctx.fillRect(0, 0, W, 9);

  ctx.textAlign = 'left';
  ctx.fillStyle = soldOut ? accent : ink;
  ctx.font = '700 40px "Space Mono", monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText(soldOut ? 'OUT OF STOCK' : project.tag.kind, 26, 72);

  ctx.font = '400 26px "Space Mono", monospace';
  ctx.letterSpacing = '2px';
  ctx.globalAlpha = 0.66;
  ctx.fillText(project.name.toUpperCase(), 26, 116);
  ctx.globalAlpha = 1;

  ctx.textAlign = 'right';
  ctx.font = '700 30px "Space Mono", monospace';
  ctx.globalAlpha = soldOut ? 0.85 : 0.55;
  ctx.fillText(project.tag.year, W - 26, 116);
  ctx.globalAlpha = 1;

  // A pinch of accent so the eye finds the card at all.
  if (!soldOut) {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(W - 40, 56, 11, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
