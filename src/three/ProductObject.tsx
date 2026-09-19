import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Object3D, type Texture } from 'three';
import type { Project } from '../data/projects';
import { createLabelTexture } from './labelTexture';
import { createStickerTexture } from './stickerTexture';
import { createBallTexture, createSwipeCardTexture } from './propTextures';
import { palette } from './tokens';
import { makeSpring, spring } from './spring';
import { hotspotObjects, input, releaseHotspot } from './hotspots';
import { shapeMeshes } from './products/shapes';
import { PRODUCT_SCALE, productLimits, shapeHeight } from './shapeMetrics';

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

interface ProductObjectProps {
  project: Project;
  position: [number, number, number];
}

/**
 * One product on the shelf.
 *
 * The mesh is the picture; its control is a real `<button>` in the DOM layer
 * above, tracked to the anchor registered here. Hover and drag state arrives
 * through a plain mutable record rather than React state, so pulling a box off
 * a shelf never re-renders the tree — it just moves.
 */
export function ProductObject({ project, position }: ProductObjectProps) {
  const group = useRef<Group>(null);
  const anchor = useRef<Object3D>(null);
  const [label, setLabel] = useState<Texture | null>(null);
  const [sticker, setSticker] = useState<Texture | null>(null);
  const [accessory, setAccessory] = useState<Texture | null>(null);

  const Shape = shapeMeshes[project.shape];
  const soldOut = project.status === 'out-of-stock';
  const color = project.brand.base;
  const limits = productLimits(project);

  useEffect(() => {
    let alive = true;
    createLabelTexture(project).then((texture) => {
      if (alive) setLabel(texture);
      else texture?.dispose();
    });
    return () => {
      alive = false;
    };
  }, [project]);

  useEffect(() => {
    if (project.status === 'in-stock') return;
    let alive = true;
    createStickerTexture(project).then((texture) => {
      if (alive) setSticker(texture);
      else texture?.dispose();
    });
    return () => {
      alive = false;
    };
  }, [project]);

  useEffect(() => {
    const make =
      project.shape === 'kiosk'
        ? createSwipeCardTexture
        : project.shape === 'boxed-set'
          ? createBallTexture
          : null;
    if (!make) return;

    let alive = true;
    make(project.brand).then((texture) => {
      if (alive) setAccessory(texture);
      else texture?.dispose();
    });
    return () => {
      alive = false;
    };
  }, [project]);

  useEffect(() => () => label?.dispose(), [label]);
  useEffect(() => () => accessory?.dispose(), [accessory]);
  useEffect(() => () => sticker?.dispose(), [sticker]);

  useEffect(() => {
    const node = anchor.current;
    if (node) hotspotObjects.set(project.id, node);
    return () => releaseHotspot(project.id);
  }, [project.id]);

  const lift = useRef(makeSpring(0));
  const squash = useRef(makeSpring(1));
  const spin = useRef(makeSpring(0));
  const dragX = useRef(makeSpring(0));
  const dragY = useRef(makeSpring(0));
  const shadow = useRef<{ material: { opacity: number } } | null>(null);

  useFrame((_, dt) => {
    if (!group.current) return;
    const state = input(project.id);
    const active = state.hovered || state.focused;

    // Every target is capped by the room around the product. A spring
    // overshoots by design, so the *output* is clamped as well as the input —
    // otherwise the bounce at the top of a lift is what puts a box through the
    // plank above it.
    const wantLift = state.dragging ? 0.3 : active ? 0.17 : 0;
    const targetLift = Math.min(wantLift, limits.up);
    const targetSquash = state.dragging ? 1.05 : active ? 0.95 : 1;
    const targetSpin = state.dragging ? 0 : active ? 0.24 : 0;

    spring(lift.current, targetLift, dt, 220, 13);
    spring(squash.current, targetSquash, dt, 260, 14);
    spring(spin.current, targetSpin, dt, 120, 11);
    spring(dragX.current, state.dragging ? state.dx : 0, dt, 150, 13);
    spring(dragY.current, state.dragging ? state.dy : 0, dt, 150, 13);

    const liftValue = clamp(lift.current.value, -0.01, limits.up);
    const offsetX = clamp(dragX.current.value, -limits.side, limits.side);
    const offsetY = clamp(dragY.current.value, -limits.down, limits.up);
    const squashValue = clamp(squash.current.value, 0.93, 1.07);

    group.current.position.set(
      position[0] + offsetX,
      position[1] + liftValue + offsetY,
      position[2],
    );
    group.current.rotation.y = spin.current.value + offsetX * 0.55;
    group.current.rotation.z = clamp(-offsetX * 0.2, -0.16, 0.16);

    const s = PRODUCT_SCALE;
    group.current.scale.set(
      s * (2 - squashValue),
      s * squashValue,
      s * (2 - squashValue),
    );

    if (shadow.current) {
      shadow.current.material.opacity = active || state.dragging ? 0.3 : 0.55;
    }
  });

  return (
    <group ref={group} position={position}>
      <Shape
        finish={project.finish}
        color={color}
        label={label}
        sticker={sticker}
        accessory={accessory}
        lit={!soldOut}
      />

      {/* Where the control sits: the middle of the object, not its feet. */}
      <object3D ref={anchor} position={[0, shapeHeight[project.shape] / 2, 0.2]} />

      {/* Contact shadow — tightens as the object lifts off the plank. */}
      <mesh
        ref={shadow as never}
        position={[0, 0.004, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.3, 24]} />
        <meshBasicMaterial color={palette.ink900()} transparent opacity={0.55} />
      </mesh>
    </group>
  );
}
