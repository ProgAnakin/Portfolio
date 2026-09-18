import { DataTexture, NearestFilter, RGBAFormat, type Texture } from 'three';
import type { ProductFinish } from '../data/projects';

/**
 * Cel shading ramps.
 *
 * A toon material samples its lighting through a tiny one-dimensional texture
 * with nearest-neighbour filtering, so a smooth falloff becomes hard bands.
 * That single change is what turns a rendered object into a drawn one.
 *
 * Each finish keeps its own identity through the *shape* of its ramp rather
 * than through roughness values: plastic gets a bright narrow top step that
 * reads as a highlight, clay gets three soft steps and no highlight at all,
 * card gets two and looks printed.
 */
const ramps = new Map<string, Texture>();

export function ramp(key: string, stops: number[]): Texture {
  const hit = ramps.get(key);
  if (hit) return hit;

  const data = new Uint8Array(stops.length * 4);
  stops.forEach((value, i) => {
    const level = Math.round(Math.max(0, Math.min(1, value)) * 255);
    data[i * 4] = level;
    data[i * 4 + 1] = level;
    data[i * 4 + 2] = level;
    data[i * 4 + 3] = 255;
  });

  const texture = new DataTexture(data, stops.length, 1, RGBAFormat);
  texture.minFilter = NearestFilter;
  texture.magFilter = NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  ramps.set(key, texture);
  return texture;
}

export const finishRamp: Record<ProductFinish, number[]> = {
  // Moulded toy: dark body, mid, then a small blown highlight.
  plastic: [0.24, 0.52, 0.8, 1],
  // Unfired clay: light sinks in, no highlight anywhere.
  clay: [0.3, 0.6, 0.86],
  // Matte rubber: one wide soft band.
  rubber: [0.26, 0.58, 0.82],
  // Cartoon chrome is drawn, not reflected: dark, then a hard bright band.
  chrome: [0.18, 0.4, 0.95, 1],
  // Printed board, flat as it gets.
  card: [0.38, 0.78],
};

export const finishRampTexture = (finish: ProductFinish) => ramp(finish, finishRamp[finish]);

/**
 * Printed artwork stays legible.
 *
 * A label is content, not surface: two bright steps so the packaging still
 * reads on the dark bottom shelf, while keeping one visible band of shading so
 * it does not float free of the room.
 */
export const labelRamp = () => ramp('label', [0.74, 1]);

/** The ramp everything that is not a product uses — wood, walls, the figure. */
export const SET_RAMP = [0.34, 0.64, 0.9];
export const skinRamp = () => ramp('skin', [0.4, 0.66, 0.88]);
export const setRamp = () => ramp('set', SET_RAMP);

/** One outline weight for the whole shop, so the drawing looks like one hand. */
export const INK = '#0c0a09';
export const OUTLINE = { thin: 0.018, medium: 0.028, heavy: 0.04 };
