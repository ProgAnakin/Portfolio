import type { Brand, BrandMark } from '../data/projects';

/**
 * The marks, drawn rather than shipped.
 *
 * Two of these exist in the world and are redrawn here from their real
 * artwork: Suaipe's glossy blue S, and Kouci's sage-and-white KC over a wave
 * with the ball tucked into it. The trainer has no identity yet, so it gets
 * one invented for it — a speech bubble with a waveform in it, which is what
 * the product actually does.
 *
 * Drawing them in code rather than loading files keeps the whole shop free of
 * downloaded assets, and lets a mark be re-coloured for the packaging, the
 * shelf talker and the box side without exporting anything three times.
 */
export type MarkRenderer = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  brand: Brand,
) => void;

/** Suaipe: a geometric S with a lit rim, the way the real one glows. */
const suaipe: MarkRenderer = (ctx, cx, cy, size, brand) => {
  const w = size;
  const stroke = (width: number, colour: string) => {
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = colour;
    ctx.beginPath();
    ctx.moveTo(cx + w * 0.33, cy - w * 0.4);
    ctx.lineTo(cx - w * 0.1, cy - w * 0.4);
    ctx.bezierCurveTo(cx - w * 0.44, cy - w * 0.4, cx - w * 0.44, cy + w * 0.02, cx - w * 0.1, cy + w * 0.02);
    ctx.lineTo(cx + w * 0.1, cy + w * 0.02);
    ctx.bezierCurveTo(cx + w * 0.44, cy + w * 0.02, cx + w * 0.44, cy + w * 0.44, cx + w * 0.1, cy + w * 0.44);
    ctx.lineTo(cx - w * 0.33, cy + w * 0.44);
    ctx.stroke();
  };

  ctx.save();
  // The glow first, so the mark sits on a halo like the original.
  ctx.globalAlpha = 0.5;
  ctx.filter = 'blur(10px)';
  stroke(w * 0.24, brand.accent);
  ctx.filter = 'none';
  ctx.globalAlpha = 1;

  stroke(w * 0.21, brand.base);
  stroke(w * 0.085, brand.accent);
  stroke(w * 0.03, '#ffffff');
  ctx.restore();
};

/** Kouci: KC, a wave, and the ball caught in it. */
const kouci: MarkRenderer = (ctx, cx, cy, size, brand) => {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const letter = size * 1.02;
  ctx.font = `800 ${letter}px "Bricolage Grotesque", sans-serif`;
  ctx.fillStyle = brand.base;
  ctx.fillText('K', cx - size * 0.26, cy - size * 0.04);
  ctx.fillStyle = brand.accent;
  ctx.fillText('C', cx + size * 0.29, cy - size * 0.04);

  // The wave sweeping under both letters.
  ctx.strokeStyle = brand.base;
  ctx.lineCap = 'round';
  ctx.lineWidth = size * 0.1;
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.62, cy + size * 0.36);
  ctx.bezierCurveTo(
    cx - size * 0.3, cy + size * 0.16,
    cx + size * 0.18, cy + size * 0.58,
    cx + size * 0.64, cy + size * 0.3,
  );
  ctx.stroke();
  ctx.lineWidth = size * 0.05;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.5, cy + size * 0.52);
  ctx.bezierCurveTo(
    cx - size * 0.2, cy + size * 0.36,
    cx + size * 0.2, cy + size * 0.7,
    cx + size * 0.6, cy + size * 0.46,
  );
  ctx.stroke();
  ctx.globalAlpha = 1;

  // The ball, sitting in the wave.
  const br = size * 0.17;
  const bx = cx - size * 0.18;
  const by = cy + size * 0.3;
  ctx.fillStyle = brand.accent;
  ctx.beginPath();
  ctx.arc(bx, by, br, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = brand.base;
  ctx.lineWidth = size * 0.028;
  ctx.beginPath();
  ctx.arc(bx, by, br, 0, Math.PI * 2);
  ctx.moveTo(bx - br, by);
  ctx.lineTo(bx + br, by);
  ctx.moveTo(bx, by - br);
  ctx.bezierCurveTo(bx + br * 0.7, by - br * 0.3, bx + br * 0.7, by + br * 0.3, bx, by + br);
  ctx.moveTo(bx, by - br);
  ctx.bezierCurveTo(bx - br * 0.7, by - br * 0.3, bx - br * 0.7, by + br * 0.3, bx, by + br);
  ctx.stroke();
  ctx.restore();
};

/** AI Call Trainer: a speech bubble with a voice in it. */
const callTrainer: MarkRenderer = (ctx, cx, cy, size, brand) => {
  ctx.save();
  const w = size * 1.06;
  const h = size * 0.82;
  const r = size * 0.22;
  const left = cx - w / 2;
  const top = cy - h / 2 - size * 0.06;

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = brand.accent;
  ctx.lineWidth = size * 0.12;
  ctx.beginPath();
  ctx.moveTo(left + r, top);
  ctx.lineTo(left + w - r, top);
  ctx.quadraticCurveTo(left + w, top, left + w, top + r);
  ctx.lineTo(left + w, top + h - r);
  ctx.quadraticCurveTo(left + w, top + h, left + w - r, top + h);
  ctx.lineTo(left + w * 0.42, top + h);
  ctx.lineTo(left + w * 0.24, top + h + size * 0.26);
  ctx.lineTo(left + w * 0.26, top + h);
  ctx.lineTo(left + r, top + h);
  ctx.quadraticCurveTo(left, top + h, left, top + h - r);
  ctx.lineTo(left, top + r);
  ctx.quadraticCurveTo(left, top, left + r, top);
  ctx.closePath();
  ctx.stroke();

  // The voice: five bars, uneven, the way a waveform is.
  const bars = [0.34, 0.66, 1, 0.52, 0.78];
  const bw = size * 0.085;
  const gap = size * 0.155;
  const mid = top + h / 2;
  ctx.fillStyle = brand.base;
  bars.forEach((level, i) => {
    const bh = h * 0.56 * level;
    const x = cx + (i - (bars.length - 1) / 2) * gap - bw / 2;
    ctx.beginPath();
    ctx.roundRect(x, mid - bh / 2, bw, bh, bw / 2);
    ctx.fill();
  });
  ctx.restore();
};

export const marks: Record<BrandMark, MarkRenderer> = {
  suaipe,
  kouci,
  'call-trainer': callTrainer,
};

export const drawMark: MarkRenderer = (ctx, cx, cy, size, brand) =>
  marks[brand.mark](ctx, cx, cy, size, brand);
