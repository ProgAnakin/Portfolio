import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, type Texture } from 'three';
import {
  createLidTexture,
  createPupilTexture,
  createStandeeTexture,
  STANDEE_H,
  STANDEE_W,
} from './standeeArt';

/** Height of the figure in world units. Everything else is derived from it. */
const HEIGHT = 1.55;
const WIDTH = (HEIGHT * STANDEE_W) / STANDEE_H;

/** Eye centres, converted from the drawing's pixel space to the plane's. */
const eye = (px: number, py: number): [number, number] => [
  (px / STANDEE_W - 0.5) * WIDTH,
  (0.5 - py / STANDEE_H) * HEIGHT,
];
const EYES: [number, number][] = [eye(306, 464), eye(450, 464)];

/**
 * The shopkeeper, drawn rather than modelled.
 *
 * Every attempt to build a face out of spheres produced something crude, so
 * this is a flat illustration standing in the room — which is also the most
 * honest object for a shop to contain: a cut-out standee by the till. It is
 * painted with its light already in it, so it sits in the scene without being
 * re-lit into mud, and it is the one place in the room where a real drawn line
 * appears at full weight.
 *
 * The pupils follow the visitor and the lids blink. Those two things are worth
 * more than any amount of geometry.
 */
export function Shopkeeper3D({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const root = useRef<Group>(null);
  const pupils = useRef<(Group | null)[]>([]);
  const lids = useRef<(Group | null)[]>([]);
  const blink = useRef({ next: 2.4, phase: 0 });

  const [art, setArt] = useState<{ body: Texture; pupil: Texture; lid: Texture } | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([createStandeeTexture(), createPupilTexture(), createLidTexture()]).then(
      ([body, pupil, lid]) => {
        if (!alive || !body || !pupil || !lid) {
          body?.dispose();
          pupil?.dispose();
          lid?.dispose();
          return;
        }
        setArt({ body, pupil, lid });
      },
    );
    return () => {
      alive = false;
    };
  }, []);

  useEffect(
    () => () => {
      art?.body.dispose();
      art?.pupil.dispose();
      art?.lid.dispose();
    },
    [art],
  );

  useFrame(({ pointer, clock }, dt) => {
    const k = Math.min(1, dt * 3.4);

    if (root.current) {
      // A cut-out cannot turn its head, so it leans — which is funnier and
      // reads from further away than a rotation would.
      root.current.rotation.y += (pointer.x * 0.16 - root.current.rotation.y) * k;
      root.current.rotation.z += (-pointer.x * 0.035 - root.current.rotation.z) * k;
      root.current.position.y =
        position[1] + Math.sin(clock.getElapsedTime() * 1.15) * 0.008;
    }

    for (const pupil of pupils.current) {
      if (!pupil) continue;
      pupil.position.x += (pointer.x * 0.016 - pupil.position.x) * k * 1.8;
      pupil.position.y += (-pointer.y * 0.01 - pupil.position.y) * k * 1.8;
    }

    blink.current.next -= dt;
    if (blink.current.next <= 0) {
      blink.current.phase = 0.17;
      blink.current.next = 2.8 + Math.random() * 3.6;
    }
    if (blink.current.phase > 0) {
      blink.current.phase -= dt;
      const shut = Math.sin(Math.max(0, blink.current.phase / 0.17) * Math.PI);
      for (const lid of lids.current) {
        if (lid) lid.scale.y = 0.02 + shut * 1.1;
      }
    }
  });

  if (!art) return null;

  return (
    <group ref={root} position={position} scale={scale}>
      <mesh>
        <planeGeometry args={[WIDTH, HEIGHT]} />
        <meshBasicMaterial map={art.body} transparent alphaTest={0.04} />
      </mesh>

      {EYES.map(([x, y], i) => (
        <group key={i} position={[x, y, 0.004]}>
          <group
            ref={(node) => {
              pupils.current[i] = node;
            }}
          >
            <mesh>
              <planeGeometry args={[0.058, 0.058]} />
              <meshBasicMaterial map={art.pupil} transparent alphaTest={0.04} />
            </mesh>
          </group>
          {/* Lid drops from the top of the eye, so it scales from its own top. */}
          <group
            position={[0, 0.036, 0.002]}
            ref={(node) => {
              lids.current[i] = node;
            }}
            scale={[1, 0.02, 1]}
          >
            <mesh position={[0, -0.03, 0]}>
              <planeGeometry args={[0.105, 0.06]} />
              <meshBasicMaterial map={art.lid} transparent alphaTest={0.04} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}
