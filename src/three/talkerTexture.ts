import { CanvasTexture, SRGBColorSpace, type Texture } from 'three';
import type { Project } from '../data/projects';
import { palette } from './tokens';
import { drawMark } from './logos';

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
  const { paper, ink, accent } = project.brand;
  const alert = palette.accent();

  ctx.fillStyle = soldOut ? '#f4e3d6' : paper;
  ctx.fillRect(0, 0, W, H);

  // A band of the brand's own colour down the left, and its mark on it.
  ctx.fillStyle = soldOut ? alert : project.brand.base;
  ctx.fillRect(0, 0, 122, H);
  drawMark(ctx, 61, H / 2, 66, {
    ...project.brand,
    base: paper,
    accent: soldOut ? '#f4e3d6' : accent,
  });

  // Kind and year share the top line; the name gets the whole second one and
  // is clipped if it has to be. "AI CALL TRAINER" ran straight into "IN DEV"
  // when both were right-aligned on the same row.
  const textLeft = 146;
  const textRight = W - 26;

  ctx.fillStyle = soldOut ? '#8f2d10' : ink;
  ctx.textAlign = 'right';
  ctx.font = '700 28px "Space Mono", monospace';
  ctx.letterSpacing = '2px';
  ctx.globalAlpha = soldOut ? 0.9 : 0.6;
  ctx.fillText(project.tag.year, textRight, 66);
  const yearWidth = ctx.measureText(project.tag.year).width + 26;
  ctx.globalAlpha = 1;

  ctx.textAlign = 'left';
  ctx.font = '700 38px "Space Mono", monospace';
  ctx.letterSpacing = '3px';
  let kind = soldOut ? 'OUT OF STOCK' : project.tag.kind;
  while (ctx.measureText(kind).width > textRight - textLeft - yearWidth && kind.length > 3) {
    kind = kind.slice(0, -1);
  }
  ctx.fillText(kind, textLeft, 68);

  ctx.font = '400 26px "Space Mono", monospace';
  ctx.letterSpacing = '2px';
  ctx.globalAlpha = 0.66;
  let name = project.name.toUpperCase();
  while (ctx.measureText(name).width > textRight - textLeft && name.length > 3) {
    name = name.slice(0, -1);
  }
  ctx.fillText(name, textLeft, 118);
  ctx.globalAlpha = 1;
  ctx.letterSpacing = '0px';

  if (!soldOut) {
    ctx.fillStyle = alert;
    ctx.beginPath();
    ctx.arc(W - 40, 108, 9, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
