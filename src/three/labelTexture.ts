import { CanvasTexture, SRGBColorSpace, type Texture } from 'three';
import type { Project } from '../data/projects';
import { palette } from './tokens';

const W = 512;
const H = 640;

/**
 * Draws the front of the box.
 *
 * Every product on these shelves is a project, so every project gets real
 * packaging: a brand line, a claim flash, a spec panel and a barcode. Drawn
 * procedurally onto a canvas rather than shipped as artwork — it costs nothing
 * to download, it stays sharp, and adding a project still means adding one
 * object to the data file.
 */
function drawLabel(ctx: CanvasRenderingContext2D, project: Project) {
  const base = palette.prod(project.tint);
  const paper = palette.paper100();
  const ink = palette.ink900();
  const amber = palette.amber300();
  const accent = palette.accent();
  const soldOut = project.status === 'out-of-stock';

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  // A band of paper across the top two-thirds — the printed area.
  ctx.fillStyle = paper;
  ctx.fillRect(28, 28, W - 56, H - 200);

  // Misregistration: the same band again, offset and knocked back. Cheap
  // trick, but it is what makes a flat fill look printed instead of filled.
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = amber;
  ctx.fillRect(33, 24, W - 56, H - 200);
  ctx.globalAlpha = 1;

  // Brand line.
  ctx.fillStyle = ink;
  ctx.font = '700 22px "Space Mono", monospace';
  ctx.letterSpacing = '4px';
  ctx.fillText('ANNICHINI & CO.', 48, 74);

  ctx.fillStyle = accent;
  ctx.fillRect(48, 88, W - 96, 5);

  // The name, as big as it will go.
  ctx.fillStyle = ink;
  ctx.letterSpacing = '0px';
  let size = 92;
  ctx.font = `800 ${size}px "Bricolage Grotesque", sans-serif`;
  while (ctx.measureText(project.name.toUpperCase()).width > W - 96 && size > 34) {
    size -= 4;
    ctx.font = `800 ${size}px "Bricolage Grotesque", sans-serif`;
  }
  ctx.fillText(project.name.toUpperCase(), 48, 100 + size);

  // Tagline, wrapped.
  ctx.font = '400 24px "Instrument Sans", sans-serif';
  ctx.fillStyle = ink;
  ctx.globalAlpha = 0.72;
  const words = project.tagline.split(' ');
  let line = '';
  let y = 148 + size;
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > W - 96) {
      ctx.fillText(line, 48, y);
      line = word;
      y += 30;
    } else {
      line = next;
    }
  }
  ctx.fillText(line, 48, y);
  ctx.globalAlpha = 1;

  // Claim flash — the loudest thing on the box, as it would be in a shop.
  const flash = soldOut ? 'OUT OF\nSTOCK' : project.stack[0]?.toUpperCase() ?? 'NEW';
  ctx.save();
  ctx.translate(W - 118, H - 258);
  ctx.rotate(-0.18);
  ctx.fillStyle = soldOut ? accent : amber;
  ctx.beginPath();
  for (let i = 0; i < 24; i += 1) {
    const a = (i / 24) * Math.PI * 2;
    const r = i % 2 === 0 ? 78 : 62;
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = ink;
  ctx.font = '700 20px "Space Mono", monospace';
  ctx.textAlign = 'center';
  flash.split('\n').forEach((part, i, all) => {
    ctx.fillText(part, 0, 8 + (i - (all.length - 1) / 2) * 22);
  });
  ctx.restore();
  ctx.textAlign = 'left';

  // Spec panel — the stack, printed like nutritional information.
  const panelY = H - 168;
  ctx.fillStyle = ink;
  ctx.globalAlpha = 0.9;
  ctx.fillRect(28, panelY, W - 56, 124);
  ctx.globalAlpha = 1;
  ctx.fillStyle = paper;
  ctx.font = '700 17px "Space Mono", monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText('BUILT WITH', 46, panelY + 30);
  ctx.letterSpacing = '0px';
  ctx.font = '400 17px "Space Mono", monospace';
  project.stack.slice(0, 3).forEach((item, i) => {
    ctx.globalAlpha = 0.75;
    ctx.fillText(item, 46, panelY + 58 + i * 22);
    ctx.globalAlpha = 1;
  });

  // Barcode + net weight.
  let x = W - 190;
  for (let i = 0; i < 26; i += 1) {
    const w = ((i * 37) % 3) + 1;
    ctx.fillStyle = paper;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(x, panelY + 30, w, 56);
    x += w + 3;
  }
  ctx.globalAlpha = 1;
  ctx.font = '400 15px "Space Mono", monospace';
  ctx.fillStyle = paper;
  ctx.globalAlpha = 0.6;
  ctx.fillText(`NET WT. ${project.tag.year}`, W - 190, panelY + 106);
  ctx.globalAlpha = 1;
}

export async function createLabelTexture(project: Project): Promise<Texture | null> {
  if (typeof document === 'undefined') return null;
  // Waiting for the webfonts matters: a label drawn before they land is set
  // in Times and looks like a bug.
  try {
    await document.fonts.ready;
  } catch {
    /* fonts API unavailable — draw with whatever is there */
  }

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  drawLabel(ctx, project);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
