import { CanvasTexture, SRGBColorSpace, type Texture } from 'three';

export const STANDEE_W = 760;
export const STANDEE_H = 1040;

const INK = '#17110c';
const SKIN = '#b87f52';
const SKIN_SHADE = '#94643e';
const SKIN_LIGHT = '#cb9161';
const HAIR = '#2a1d15';
const HAIR_LIGHT = '#3f2c1f';
const TEE = '#2e2620';
const TEE_LIGHT = '#443a2f';
const GOLD = '#d7a54a';
const LIP = '#9a6350';
const EYE_WHITE = '#efe7db';

/**
 * The curls, as a union of circles.
 *
 * Drawing the cluster twice — once oversized in ink, then again in hair
 * colour — outlines the silhouette of the whole mass without drawing a line
 * between neighbouring curls. It is the cheapest way to get a cut-out edge,
 * and it is why the hair reads as one shape instead of a bag of spheres.
 */
const CURLS: [number, number, number][] = [
  [258, 246, 66], [330, 206, 74], [412, 200, 76], [488, 232, 70], [538, 288, 60],
  [214, 300, 60], [300, 250, 60], [376, 244, 62], [452, 252, 58],
  [206, 366, 46], [546, 362, 46],
  [252, 318, 50], [500, 320, 50],
  [300, 306, 46], [452, 306, 46], [376, 300, 46],
  // The fade: small, tight to the temple, stopping above the ear.
  [204, 414, 30], [552, 410, 30],
];

function curlCluster(ctx: CanvasRenderingContext2D, grow: number, fill: string) {
  ctx.fillStyle = fill;
  for (const [x, y, r] of CURLS) {
    ctx.beginPath();
    ctx.arc(x, y, r + grow, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Head, jaw and chin as one tapered path rather than an oval. */
function headPath(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(214, 372);
  ctx.bezierCurveTo(214, 250, 290, 196, 378, 196);
  ctx.bezierCurveTo(466, 196, 542, 250, 542, 372);
  ctx.bezierCurveTo(542, 452, 516, 512, 470, 548);
  ctx.bezierCurveTo(440, 572, 412, 584, 378, 584);
  ctx.bezierCurveTo(344, 584, 316, 572, 286, 548);
  ctx.bezierCurveTo(240, 512, 214, 452, 214, 372);
  ctx.closePath();
}

function draw(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, STANDEE_W, STANDEE_H);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // --- Shoulders -----------------------------------------------------------
  ctx.beginPath();
  ctx.moveTo(72, STANDEE_H);
  ctx.bezierCurveTo(78, 880, 132, 790, 250, 752);
  ctx.lineTo(506, 752);
  ctx.bezierCurveTo(624, 790, 678, 880, 684, STANDEE_H);
  ctx.closePath();
  ctx.fillStyle = TEE;
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 15;
  ctx.stroke();

  // Light down the right shoulder, matching the pendant.
  ctx.save();
  ctx.clip();
  ctx.fillStyle = TEE_LIGHT;
  ctx.beginPath();
  ctx.moveTo(520, 740);
  ctx.bezierCurveTo(640, 800, 690, 890, 696, STANDEE_H);
  ctx.lineTo(600, STANDEE_H);
  ctx.bezierCurveTo(596, 880, 566, 800, 500, 764);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Collar
  ctx.beginPath();
  ctx.moveTo(276, 748);
  ctx.quadraticCurveTo(378, 812, 480, 748);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 13;
  ctx.stroke();

  // --- Neck ----------------------------------------------------------------
  ctx.beginPath();
  ctx.moveTo(310, 548);
  ctx.lineTo(310, 742);
  ctx.lineTo(446, 742);
  ctx.lineTo(446, 548);
  ctx.closePath();
  ctx.fillStyle = SKIN_SHADE;
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 14;
  ctx.stroke();

  // Chain
  ctx.beginPath();
  ctx.moveTo(300, 726);
  ctx.quadraticCurveTo(378, 786, 456, 726);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 9;
  ctx.stroke();

  // --- Ears ----------------------------------------------------------------
  for (const x of [214, 542]) {
    ctx.beginPath();
    ctx.ellipse(x, 404, 26, 40, 0, 0, Math.PI * 2);
    ctx.fillStyle = SKIN_SHADE;
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 13;
    ctx.stroke();
  }
  // The stud, in the right ear.
  ctx.beginPath();
  ctx.arc(208, 436, 11, 0, Math.PI * 2);
  ctx.fillStyle = GOLD;
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.stroke();

  // --- Head ----------------------------------------------------------------
  headPath(ctx);
  ctx.fillStyle = SKIN;
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 15;
  ctx.stroke();

  // Light on the right of the face, shadow on the left.
  ctx.save();
  headPath(ctx);
  ctx.clip();
  ctx.fillStyle = SKIN_LIGHT;
  ctx.beginPath();
  ctx.moveTo(430, 180);
  ctx.bezierCurveTo(520, 220, 560, 330, 540, 430);
  ctx.bezierCurveTo(520, 520, 470, 580, 400, 600);
  ctx.lineTo(560, 600);
  ctx.lineTo(560, 160);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = SKIN_SHADE;
  ctx.beginPath();
  ctx.moveTo(200, 180);
  ctx.lineTo(268, 180);
  ctx.bezierCurveTo(232, 260, 226, 380, 258, 470);
  ctx.lineTo(200, 470);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // --- Hair ----------------------------------------------------------------
  curlCluster(ctx, 13, INK);
  curlCluster(ctx, 0, HAIR);
  // A lit edge along the top right of the mass.
  ctx.save();
  ctx.beginPath();
  ctx.rect(390, 130, 260, 200);
  ctx.clip();
  curlCluster(ctx, -8, HAIR_LIGHT);
  ctx.restore();

  // --- Brows ---------------------------------------------------------------
  ctx.strokeStyle = HAIR;
  ctx.lineWidth = 21;
  ctx.beginPath();
  ctx.moveTo(268, 424);
  ctx.quadraticCurveTo(310, 404, 348, 416);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(488, 424);
  ctx.quadraticCurveTo(446, 404, 408, 416);
  ctx.stroke();

  // --- Eye whites (pupils are separate, so they can follow the cursor) ------
  for (const cx of [306, 450]) {
    ctx.beginPath();
    ctx.moveTo(cx - 40, 464);
    ctx.quadraticCurveTo(cx, 436, cx + 40, 464);
    ctx.quadraticCurveTo(cx, 500, cx - 40, 464);
    ctx.closePath();
    ctx.fillStyle = EYE_WHITE;
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 8;
    ctx.stroke();
  }

  // --- Nose ----------------------------------------------------------------
  ctx.strokeStyle = SKIN_SHADE;
  ctx.lineWidth = 11;
  ctx.beginPath();
  ctx.moveTo(374, 452);
  ctx.quadraticCurveTo(360, 508, 382, 520);
  ctx.stroke();

  // --- Mouth ---------------------------------------------------------------
  ctx.strokeStyle = LIP;
  ctx.lineWidth = 15;
  ctx.beginPath();
  ctx.moveTo(330, 556);
  ctx.quadraticCurveTo(378, 570, 426, 556);
  ctx.stroke();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.globalAlpha = 0.5;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

async function paint(drawFn: (ctx: CanvasRenderingContext2D) => void, w: number, h: number) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  drawFn(ctx);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export async function createStandeeTexture(): Promise<Texture | null> {
  if (typeof document === 'undefined') return null;
  return paint(draw, STANDEE_W, STANDEE_H);
}

/** One eye, drawn on its own so it can look where the visitor is. */
export async function createPupilTexture(): Promise<Texture | null> {
  if (typeof document === 'undefined') return null;
  return paint((ctx) => {
    ctx.clearRect(0, 0, 96, 96);
    ctx.fillStyle = '#241a14';
    ctx.beginPath();
    ctx.arc(48, 48, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#efe7db';
    ctx.beginPath();
    ctx.arc(58, 38, 8, 0, Math.PI * 2);
    ctx.fill();
  }, 96, 96);
}

/** The lid, for blinking: skin over the eye, with the lash line under it. */
export async function createLidTexture(): Promise<Texture | null> {
  if (typeof document === 'undefined') return null;
  return paint((ctx) => {
    ctx.clearRect(0, 0, 128, 64);
    ctx.fillStyle = SKIN;
    ctx.fillRect(0, 0, 128, 52);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(4, 50);
    ctx.lineTo(124, 50);
    ctx.stroke();
  }, 128, 64);
}
