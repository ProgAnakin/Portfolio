import type { Object3D } from 'three';

/**
 * The bridge between the room and the controls.
 *
 * Every interactive thing in the shop is a real `<button>` in ordinary DOM,
 * positioned over the canvas by projecting the object's world position to the
 * screen each frame. Two plain maps carry it, written from `useFrame` and read
 * from a rAF loop, so hovering a product never triggers a React render — the
 * scene stays at frame rate and the control stays a control.
 *
 * (drei's `<Html>` does the same job, but it portals into the canvas's parent
 * and proved unreliable for nested objects here. This is the same idea with
 * the moving parts visible.)
 */
export interface HotspotFrame {
  /** Screen position of the object's anchor, in CSS pixels. */
  x: number;
  y: number;
  /** Shrinks with distance, so the hit area matches the drawn size. */
  scale: number;
  visible: boolean;
}

export interface HotspotInput {
  hovered: boolean;
  focused: boolean;
  dragging: boolean;
  /** Drag offset in world units. */
  dx: number;
  dy: number;
}

export const hotspotObjects = new Map<string, Object3D>();
export const hotspotFrames = new Map<string, HotspotFrame>();
export const hotspotInputs = new Map<string, HotspotInput>();

/** World units per screen pixel at the scene's working depth. Set each frame. */
export const projection = { worldPerPixel: 0.004 };

export function input(id: string): HotspotInput {
  let found = hotspotInputs.get(id);
  if (!found) {
    found = { hovered: false, focused: false, dragging: false, dx: 0, dy: 0 };
    hotspotInputs.set(id, found);
  }
  return found;
}

export function releaseHotspot(id: string) {
  hotspotObjects.delete(id);
  hotspotFrames.delete(id);
  hotspotInputs.delete(id);
}
