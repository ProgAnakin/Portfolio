import { CanvasTexture, RepeatWrapping, SRGBColorSpace, type Texture } from 'three';
import type { Brand } from '../data/projects';

async function paint(
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D) => void,
): Promise<Texture | null> {
  if (typeof document === 'undefined') return null;
  try {
    await document.fonts.ready;
  } catch {
    /* draw with whatever is loaded */
  }
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  draw(ctx);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/**
 * The quiz card caught mid-swipe on the kiosk.
 *
 * It was a blank slab, which on a shelf reads as a label someone forgot to
 * print. At the size it appears on screen only one thing can be legible, so
 * it carries one thing: the question mark, with the two answers it is being
 * thrown between.
 */
export function createSwipeCardTexture(brand: Brand): Promise<Texture | null> {
  return paint(256, 336, (ctx) => {
    ctx.fillStyle = brand.paper;
    ctx.fillRect(0, 0, 256, 336);

    ctx.fillStyle = brand.base;
    ctx.fillRect(0, 0, 256, 16);

    ctx.textAlign = 'center';
    ctx.fillStyle = brand.base;
    ctx.font = '800 150px "Bricolage Grotesque", sans-serif';
    ctx.fillText('?', 128, 190);

    ctx.font = '700 22px "Space Mono", monospace';
    ctx.letterSpacing = '3px';
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = brand.ink;
    ctx.fillText('QUESTION 3/8', 128, 62);
    ctx.globalAlpha = 1;

    // The two answers it is being thrown between.
    const pill = (x: number, colour: string) => {
      ctx.fillStyle = colour;
      ctx.beginPath();
      ctx.roundRect(x, 246, 86, 44, 22);
      ctx.fill();
    };
    pill(26, brand.accent);
    pill(144, brand.base);
    ctx.fillStyle = brand.paper;
    ctx.font = '700 26px "Space Mono", monospace';
    ctx.letterSpacing = '0px';
    ctx.fillText('NO', 69, 277);
    ctx.fillText('YES', 187, 277);
  });
}

/**
 * The water polo ball beside the Kouci box.
 *
 * A plain sphere reads as a blank disc from the front. Real ones are panelled
 * and gripped, so this one is too — the pattern is what makes it a ball
 * rather than a dot.
 */
export function createBallTexture(brand: Brand): Promise<Texture | null> {
  return paint(512, 256, (ctx) => {
    ctx.fillStyle = '#e8ae3c';
    ctx.fillRect(0, 0, 512, 256);

    // Panel seams, running pole to pole.
    ctx.strokeStyle = brand.ink;
    ctx.globalAlpha = 0.72;
    ctx.lineWidth = 9;
    for (let i = 0; i < 6; i += 1) {
      const x = (i / 6) * 512 + 42;
      ctx.beginPath();
      ctx.moveTo(x, -10);
      ctx.bezierCurveTo(x - 26, 80, x - 26, 176, x, 266);
      ctx.stroke();
    }
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(0, 128);
    ctx.lineTo(512, 128);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Grip.
    ctx.fillStyle = brand.ink;
    ctx.globalAlpha = 0.16;
    for (let y = 18; y < 256; y += 17) {
      for (let x = ((y / 17) % 2) * 9; x < 512; x += 18) {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // A band of the club's own colour.
    ctx.fillStyle = brand.base;
    ctx.globalAlpha = 0.9;
    ctx.fillRect(0, 112, 512, 9);
    ctx.fillRect(0, 136, 512, 9);
    ctx.globalAlpha = 1;
  }).then((texture) => {
    if (texture) {
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
    }
    return texture;
  });
}
