import { CanvasTexture, SRGBColorSpace, type Texture } from 'three';
import type { Brand, Project } from '../data/projects';
import { drawMark } from './logos';

const W = 512;
const H = 640;

/**
 * The front of the box.
 *
 * Every product on these shelves is a project, so every project gets real
 * packaging — and three boxes sharing one layout read as three of the same
 * thing. Each brand gets its own: Suaipe's is the kiosk's own start screen,
 * Kouci's is sports packaging with a banded diagonal, and the trainer's is a
 * shipping label with a stamp on it, because it has not shipped.
 */
type Layout = (ctx: CanvasRenderingContext2D, project: Project, brand: Brand) => void;


function fitText(ctx: CanvasRenderingContext2D, text: string, max: number, start: number, weight = 800) {
  let size = start;
  ctx.font = `${weight} ${size}px "Bricolage Grotesque", sans-serif`;
  while (ctx.measureText(text).width > max && size > 24) {
    size -= 3;
    ctx.font = `${weight} ${size}px "Bricolage Grotesque", sans-serif`;
  }
  return size;
}

function barcode(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, colour: string) {
  let cursor = x;
  ctx.fillStyle = colour;
  for (let i = 0; i < 26; i += 1) {
    const w = ((i * 37) % 3) + 1;
    ctx.fillRect(cursor, y, w, h);
    cursor += w + 3;
  }
}

/** Suaipe: the screen a customer actually sees, not a box. */
const suaipeLayout: Layout = (ctx, project, brand) => {
  const glow = ctx.createRadialGradient(W / 2, H * 0.34, 20, W / 2, H * 0.34, W * 0.72);
  glow.addColorStop(0, '#153d9e');
  glow.addColorStop(1, brand.ink);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = brand.paper;
  ctx.font = '700 19px "Space Mono", monospace';
  ctx.letterSpacing = '5px';
  ctx.globalAlpha = 0.72;
  ctx.fillText('ANNICHINI & CO.', 38, 54);
  ctx.globalAlpha = 1;
  ctx.letterSpacing = '0px';

  drawMark(ctx, W / 2, H * 0.34, 150, brand);

  ctx.textAlign = 'center';
  ctx.fillStyle = brand.paper;
  const size = fitText(ctx, 'SUAIPE', W - 90, 86);
  ctx.fillText('SUAIPE', W / 2, H * 0.34 + 160 + size * 0.2);

  ctx.font = '400 22px "Instrument Sans", sans-serif';
  ctx.globalAlpha = 0.74;
  ctx.fillText('Eight questions. One match.', W / 2, H * 0.34 + 205);
  ctx.globalAlpha = 1;

  // The swipe affordance, as the app shows it.
  ctx.strokeStyle = brand.accent;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  const cy = H - 132;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 78, cy);
  ctx.lineTo(W / 2 + 78, cy);
  ctx.stroke();
  for (const [dx, dir] of [[-96, -1], [96, 1]] as const) {
    ctx.beginPath();
    ctx.moveTo(W / 2 + dx - dir * 18, cy - 15);
    ctx.lineTo(W / 2 + dx, cy);
    ctx.lineTo(W / 2 + dx - dir * 18, cy + 15);
    ctx.stroke();
  }

  ctx.font = '400 17px "Space Mono", monospace';
  ctx.letterSpacing = '4px';
  ctx.fillStyle = brand.accent;
  ctx.fillText('SWIPE TO START', W / 2, H - 76);
  ctx.letterSpacing = '0px';
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = brand.paper;
  ctx.font = '400 15px "Space Mono", monospace';
  ctx.fillText(project.stack.slice(0, 3).join(' · '), W / 2, H - 40);
  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';
};

/** Kouci: sports packaging — banded, loud, with the club colours on it. */
const kouciLayout: Layout = (ctx, project, brand) => {
  ctx.fillStyle = brand.base;
  ctx.fillRect(0, 0, W, H);

  // The diagonal band the whole thing hangs off.
  ctx.save();
  ctx.fillStyle = brand.paper;
  ctx.beginPath();
  ctx.moveTo(0, H * 0.2);
  ctx.lineTo(W, H * 0.08);
  ctx.lineTo(W, H * 0.66);
  ctx.lineTo(0, H * 0.78);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Lane lines, bottom third.
  ctx.strokeStyle = brand.paper;
  ctx.globalAlpha = 0.28;
  ctx.lineWidth = 6;
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.moveTo(24, H * 0.83 + i * 22);
    ctx.lineTo(W - 24, H * 0.815 + i * 22);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = brand.ink;
  ctx.font = '700 19px "Space Mono", monospace';
  ctx.letterSpacing = '5px';
  ctx.fillText('ANNICHINI & CO.', 34, H * 0.16);
  ctx.letterSpacing = '0px';

  drawMark(ctx, W * 0.32, H * 0.36, 128, brand);

  ctx.textAlign = 'right';
  ctx.fillStyle = brand.ink;
  const size = fitText(ctx, 'KOUCI', W * 0.5, 78);
  ctx.fillText('KOUCI', W - 34, H * 0.36);
  ctx.font = '400 21px "Instrument Sans", sans-serif';
  ctx.globalAlpha = 0.7;
  ctx.fillText('Water polo, measured', W - 34, H * 0.36 + size * 0.5);
  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';

  ctx.fillStyle = brand.paper;
  ctx.font = '700 17px "Space Mono", monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText('LIVE STATS · TACTICS · ROSTERS', 34, H * 0.73);
  ctx.letterSpacing = '0px';

  barcode(ctx, 34, H - 72, 44, brand.paper);
  ctx.textAlign = 'right';
  ctx.font = '400 16px "Space Mono", monospace';
  ctx.globalAlpha = 0.72;
  ctx.fillText(`NET WT. ${project.tag.year}`, W - 34, H - 40);
  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';
};

/** AI Call Trainer: a shipping label, stamped, because it has not shipped. */
const trainerLayout: Layout = (ctx, project, brand) => {
  ctx.fillStyle = brand.paper;
  ctx.fillRect(0, 0, W, H);

  // Kraft grain.
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = brand.ink;
  for (let i = 0; i < 260; i += 1) {
    ctx.fillRect(Math.random() * W, Math.random() * H, 2, 1);
  }
  ctx.globalAlpha = 1;

  ctx.strokeStyle = brand.ink;
  ctx.lineWidth = 6;
  ctx.strokeRect(22, 22, W - 44, H - 44);

  ctx.fillStyle = brand.ink;
  ctx.font = '700 18px "Space Mono", monospace';
  ctx.letterSpacing = '4px';
  ctx.fillText('ANNICHINI & CO.', 46, 74);
  ctx.letterSpacing = '0px';
  ctx.fillRect(46, 92, W - 92, 4);

  drawMark(ctx, 104, 182, 96, brand);

  ctx.font = '400 17px "Space Mono", monospace';
  ctx.globalAlpha = 0.6;
  ctx.fillText('CONTENTS', 178, 158);
  ctx.globalAlpha = 1;
  ctx.fillStyle = brand.ink;
  const size = fitText(ctx, 'AI CALL', W - 220, 56);
  ctx.fillText('AI CALL', 178, 204);
  ctx.fillText('TRAINER', 178, 204 + size * 0.98);

  ctx.font = '400 20px "Instrument Sans", sans-serif';
  ctx.globalAlpha = 0.7;
  ctx.fillText('Cold-call simulator with', 46, 320);
  ctx.fillText('feedback on every objection.', 46, 348);
  ctx.globalAlpha = 1;

  // The stamp.
  ctx.save();
  ctx.translate(W / 2, H * 0.68);
  ctx.rotate(-0.16);
  ctx.strokeStyle = brand.accent;
  ctx.lineWidth = 7;
  ctx.strokeRect(-166, -44, 332, 88);
  ctx.fillStyle = brand.accent;
  ctx.textAlign = 'center';
  ctx.font = '700 40px "Space Mono", monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText('IN DEVELOPMENT', 0, 14);
  ctx.letterSpacing = '0px';
  ctx.textAlign = 'left';
  ctx.restore();

  barcode(ctx, 46, H - 104, 46, brand.ink);
  ctx.font = '400 16px "Space Mono", monospace';
  ctx.fillStyle = brand.ink;
  ctx.globalAlpha = 0.62;
  ctx.fillText(`DO NOT STOCK · ${project.tag.year}`, 46, H - 42);
  ctx.globalAlpha = 1;
};

const layouts: Record<string, Layout> = {
  suaipe: suaipeLayout,
  kouci: kouciLayout,
  'call-trainer': trainerLayout,
};

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

  ctx.clearRect(0, 0, W, H);
  (layouts[project.brand.mark] ?? kouciLayout)(ctx, project, project.brand);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
