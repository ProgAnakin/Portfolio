import { useEffect, useState } from 'react';
import type { Texture } from 'three';
import type { Project } from '../data/projects';
import { createTalkerTexture } from './talkerTexture';
import { labelRamp } from './toon';
import { palette } from './tokens';
import { SHELF_X, SHELF_Y, SLOT_GAP } from './ShelfRig';

const DEPTH = 0.72;

/**
 * The card clipped to the shelf lip under a product.
 *
 * It stays put when the product is lifted — a talker belongs to the shelf, not
 * to the stock. This is the element that makes a row of objects read as a
 * display rather than as storage, and it is where the status shouts.
 */
export function ShelfTalker({ project }: { project: Project }) {
  const [texture, setTexture] = useState<Texture | null>(null);

  useEffect(() => {
    let alive = true;
    createTalkerTexture(project).then((made) => {
      if (alive) setTexture(made);
      else made?.dispose();
    });
    return () => {
      alive = false;
    };
  }, [project]);

  useEffect(() => () => texture?.dispose(), [texture]);
  if (!texture) return null;

  const x = SHELF_X - 0.75 + project.slot * SLOT_GAP;
  const y = (SHELF_Y[project.shelf] ?? SHELF_Y[0]) - 0.205;

  return (
    <group position={[x, y, DEPTH / 2 + 0.01]} rotation={[0.38, 0, 0]}>
      <mesh key={texture.uuid}>
        <planeGeometry args={[0.66, 0.206]} />
        <meshToonMaterial map={texture} gradientMap={labelRamp()} side={2} />
      </mesh>
      {/* The clip holding it on. */}
      <mesh position={[0, 0.115, 0.004]}>
        <boxGeometry args={[0.1, 0.04, 0.014]} />
        <meshToonMaterial color={palette.ink600()} gradientMap={labelRamp()} />
      </mesh>
    </group>
  );
}
