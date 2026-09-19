import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { Group } from 'three';
import { Ink } from './materials';
import { setRamp, skinRamp } from './toon';
import { palette } from './tokens';

/**
 * The curls sit on top of the head and stop at the temple.
 *
 * The two that used to hang level with the jaw turned the whole silhouette
 * into a hood with a face-shaped hole in it, which is the one thing a
 * featureless figure cannot afford.
 */
const CURLS: [number, number, number, number][] = [
  [-0.15, 0.15, -0.04, 0.115],
  [0.02, 0.22, -0.05, 0.125],
  [0.17, 0.14, -0.04, 0.11],
  [0.21, 0.03, -0.08, 0.085],
  [-0.2, 0.04, -0.07, 0.088],
  [-0.08, 0.2, 0.04, 0.1],
  [0.1, 0.19, 0.05, 0.095],
  [0.19, -0.05, -0.12, 0.07],
  [-0.18, -0.06, -0.12, 0.068],
  [0.0, 0.18, -0.16, 0.105],
];

/**
 * The shopkeeper, in clay.
 *
 * The original one, and the right one: clay takes light softly and has no
 * highlight, so the figure stays a silhouette with volume rather than becoming
 * a character model. No face — a featureless figure reads as *someone* from
 * any distance, where a drawn one only ever reads as one person.
 *
 * The head tracks the cursor. That is the one piece of eye contact in the
 * room, and the reason the shop feels attended rather than abandoned.
 *
 * Cel-shaded and inked like everything else, so it belongs to the drawing
 * rather than visiting it.
 */
export function Shopkeeper3D({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const head = useRef<Group>(null);
  const body = useRef<Group>(null);

  // Plain hex on purpose: three.js Color cannot parse color-mix(), and an
  // unparsed string silently leaves the material white.
  const skin = '#6d583f';
  const shirt = palette.ink600();

  useFrame(({ pointer, clock }, dt) => {
    const k = Math.min(1, dt * 3.4);

    if (head.current) {
      // Looks where you are, but only so far — a neck, not a turret.
      head.current.rotation.y += (pointer.x * 0.5 - head.current.rotation.y) * k;
      head.current.rotation.x += (-pointer.y * 0.22 - head.current.rotation.x) * k;
    }
    if (body.current) {
      body.current.rotation.y += (pointer.x * 0.14 - body.current.rotation.y) * k;
      // A slow breath, so a still figure is not a frozen one.
      body.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 1.1) * 0.006;
    }
  });

  return (
    <group ref={body} position={position} scale={scale}>
      {/* Shoulders */}
      <RoundedBox args={[0.62, 0.52, 0.36]} radius={0.16} smoothness={4} position={[0, 0.26, 0]}>
        <meshToonMaterial color={shirt} gradientMap={setRamp()} />
        <Ink weight="heavy" />
      </RoundedBox>

      <group ref={head} position={[0, 0.62, 0]}>
        {/* Neck */}
        <mesh position={[0, -0.13, 0]}>
          <cylinderGeometry args={[0.08, 0.095, 0.14, 16]} />
          <meshToonMaterial color={skin} gradientMap={skinRamp()} />
        </mesh>
        {/* Head */}
        <mesh>
          <sphereGeometry args={[0.2, 30, 26]} />
          <meshToonMaterial color={skin} gradientMap={skinRamp()} />
          <Ink weight="heavy" />
        </mesh>
        {/* Curls, deliberately uneven. Only the head carries an outline: inking
            each curl is what turns a cluster into a visible bag of spheres. */}
        {CURLS.map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[r, 16, 14]} />
            <meshToonMaterial color={shirt} gradientMap={setRamp()} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
