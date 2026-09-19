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
/** '#rrggbb' → the three numbers a pixel loop needs. */
function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * The match ball.
 *
 * It was a beige circle with curves drawn on it, because the seams were drawn
 * in UV space — where a straight line is not a great circle and a panel is not
 * a panel. This paints it in the *sphere's* space instead: every pixel is
 * turned back into a direction, and the seams fall where the six panels of a
 * real ball meet, which is where the two largest components of that direction
 * are equal. Curvature comes out right on its own, including at the poles,
 * where the old version pinched.
 *
 * The dimples are laid on rings whose count follows the latitude, so they stay
 * round and evenly spaced instead of crowding into the poles — that grain is
 * most of what stops a sphere reading as a flat disc at this size.
 *
 * One pass over 512×256 at load. Nothing here runs per frame.
 */
export function createBallTexture(brand: Brand): Promise<Texture | null> {
  return paint(512, 256, (ctx) => {
    const w = 512;
    const h = 256;
    const img = ctx.createImageData(w, h);
    const px = img.data;

    const skin = rgb('#f0c22a');
    const deep = rgb('#d09f16');
    const seam = rgb(brand.ink);
    const band = rgb(brand.base);
    const mark = rgb(brand.accent);

    const RINGS = 30;
    const mix = (a: [number, number, number], b: [number, number, number], t: number, o: number) => {
      px[o] = a[0] + (b[0] - a[0]) * t;
      px[o + 1] = a[1] + (b[1] - a[1]) * t;
      px[o + 2] = a[2] + (b[2] - a[2]) * t;
      px[o + 3] = 255;
    };

    for (let j = 0; j < h; j += 1) {
      const phi = ((j + 0.5) / h) * Math.PI;
      const sinPhi = Math.sin(phi);
      const y = Math.cos(phi);

      // Dimples sit on rings, and each ring holds as many as its circumference
      // can take.
      const ring = Math.round((phi / Math.PI) * RINGS);
      const ringPhi = (ring / RINGS) * Math.PI;
      const perRing = Math.max(1, Math.round(Math.sin(ringPhi) * 54));
      const dp = (phi - ringPhi) / (Math.PI / RINGS);

      for (let i = 0; i < w; i += 1) {
        const theta = ((i + 0.5) / w) * Math.PI * 2;
        const x = sinPhi * Math.cos(theta);
        const z = sinPhi * Math.sin(theta);
        const o = (j * w + i) * 4;

        // Panel seams: the edges of a cube pushed out onto the sphere.
        const ax = Math.abs(x);
        const ay = Math.abs(y);
        const az = Math.abs(z);
        const first = Math.max(ax, ay, az);
        const second = Math.max(Math.min(ax, ay), Math.min(Math.max(ax, ay), az));
        const edge = 1 - second / first;

        // The club's stripe, around one great circle, printed over the panels.
        const stripe = Math.abs(x * 0.32 + y * 0.9 + z * 0.29);

        let tone = skin;
        let t = 0;

        const a = (theta / (Math.PI * 2)) * perRing;
        const da = a - Math.round(a);
        const dimple = da * da * 3.4 + dp * dp * 1.5;
        if (dimple < 0.5) t = 0.28 * (1 - dimple / 0.5);
        mix(skin, deep, t, o);

        if (stripe < 0.085) {
          tone = stripe < 0.052 ? band : mark;
          mix([px[o], px[o + 1], px[o + 2]], tone, 0.88, o);
        }

        if (edge < 0.075) {
          const soft = Math.min(1, (0.075 - edge) / 0.022);
          mix([px[o], px[o + 1], px[o + 2]], seam, soft * 0.94, o);
        }
      }
    }

    ctx.putImageData(img, 0, 0);
  }).then((texture) => {
    if (texture) {
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
      texture.anisotropy = 8;
    }
    return texture;
  });
}
