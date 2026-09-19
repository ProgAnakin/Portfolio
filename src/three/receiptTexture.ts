import { CanvasTexture, LinearFilter, SRGBColorSpace, type Texture } from 'three';

/**
 * What is printed on the paper coming out of the machine.
 *
 * Generic on purpose: the readable receipt is the sheet the till opens in the
 * DOM, and this is the prop in the room. It only has to say *receipt* from two
 * metres away — a header block, ruled items, a total, a barcode. Drawn once
 * and mapped along the strip, so new lines appear as the paper feeds rather
 * than the whole thing stretching.
 */
export function createReceiptTexture(): Texture | null {
  if (typeof document === 'undefined') return null;
  const w = 128;
  const h = 768;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#f2ece0';
  ctx.fillRect(0, 0, w, h);

  const ink = 'rgba(28, 24, 20, 0.82)';
  const faint = 'rgba(28, 24, 20, 0.34)';

  // v = 0 is the free end, which is the *top* of the receipt — it is printed
  // first and travels furthest. So the header sits at the bottom of the canvas.
  ctx.save();
  ctx.translate(0, h);
  ctx.scale(1, -1);

  ctx.fillStyle = ink;
  ctx.fillRect(16, 24, w - 32, 3);
  ctx.fillRect(22, 36, w - 44, 2);

  ctx.font = '700 15px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('RECEIPT', w / 2, 62);
  ctx.font = '400 10px "Space Mono", monospace';
  ctx.fillStyle = faint;
  ctx.fillText('THANK YOU', w / 2, 78);

  // Ruled items: a name on the left, a figure on the right.
  let y = 104;
  for (let i = 0; i < 16; i += 1) {
    const left = 14 + ((i * 37) % 26);
    const nameWidth = 34 + ((i * 23) % 30);
    ctx.fillStyle = i % 4 === 3 ? faint : ink;
    ctx.fillRect(left, y, nameWidth, 3);
    ctx.fillRect(w - 46, y, 30 - ((i * 11) % 12), 3);
    y += i % 4 === 3 ? 26 : 17;
  }

  ctx.fillStyle = faint;
  for (let x = 14; x < w - 14; x += 7) ctx.fillRect(x, y, 4, 2);
  y += 18;

  ctx.fillStyle = ink;
  ctx.font = '700 13px "Space Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('TOTAL', 16, y + 10);
  ctx.textAlign = 'right';
  ctx.fillText('0.00', w - 16, y + 10);
  y += 34;

  // Barcode.
  for (let x = 18; x < w - 18; ) {
    const bar = 2 + ((x * 7) % 5);
    ctx.fillStyle = ink;
    ctx.fillRect(x, y, bar, 34);
    x += bar + 2 + ((x * 3) % 4);
  }

  ctx.restore();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

/** The amber window on the front of the machine. */
export function createDisplayTexture(): Texture | null {
  if (typeof document === 'undefined') return null;
  const w = 256;
  const h = 84;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#1b1408';
  ctx.fillRect(0, 0, w, h);

  ctx.font = '700 52px "Space Mono", monospace';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  // The unlit segments behind the number, which is what makes a display read
  // as a display rather than as a sticker with a number on it.
  ctx.fillStyle = 'rgba(248, 220, 174, 0.12)';
  ctx.fillText('8.88', w - 14, h / 2 + 2);
  ctx.fillStyle = '#f8dcae';
  ctx.fillText('0.00', w - 14, h / 2 + 2);

  ctx.font = '400 13px "Space Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(248, 220, 174, 0.5)';
  ctx.fillText('TOTAL', 14, 22);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}
