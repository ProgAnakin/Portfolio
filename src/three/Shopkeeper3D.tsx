import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { Group, Mesh } from 'three';
import { Ink } from './materials';
import { setRamp, skinRamp } from './toon';

const R = 0.28;

const SKIN = '#c28a5c';
const HAIR = '#2b1e16';
const SHIRT = '#d8cdbb';
const APRON = '#3d4b4f';
const APRON_TRIM = '#566a6f';
const GOLD = '#d7a54a';
const EYE = '#241a14';
const LIP = '#8f5a47';

/**
 * Curl bumps, placed only where the silhouette needs them.
 *
 * The hair is one capped mass with these sitting on its edge. Only the cap is
 * inked: outlining every bump is what turned the last attempt into a visible
 * bag of spheres, and the bumps do not need an edge of their own to read as
 * curls — they only need to break the outline. [x, y, z, radius]
 */
const CURLS: [number, number, number, number][] = [
  [-0.16, 0.26, 0.05, 0.11],
  [0.03, 0.32, 0.03, 0.12],
  [0.19, 0.25, 0.03, 0.105],
  [-0.07, 0.28, 0.17, 0.1],
  [0.13, 0.27, 0.15, 0.095],
  [-0.21, 0.19, -0.1, 0.1],
  [0.23, 0.18, -0.1, 0.1],
  [0.05, 0.31, -0.14, 0.11],
  [-0.15, 0.24, -0.2, 0.095],
  [0.17, 0.24, -0.2, 0.095],
  [-0.25, 0.11, -0.02, 0.07],
  [0.26, 0.11, -0.02, 0.07],
];

/**
 * The shopkeeper: generic on purpose, and dressed for the job.
 *
 * An apron over a collared shirt with a name badge on it says *someone works
 * here* faster than a face can, which is the whole point of the figure. The
 * head follows the cursor, the eyes lead it, and it blinks.
 */
export function Shopkeeper3D({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const body = useRef<Group>(null);
  const head = useRef<Group>(null);
  const eyes = useRef<Group>(null);
  const lids = useRef<(Mesh | null)[]>([]);
  const blink = useRef({ next: 2.6, phase: 0 });

  useFrame(({ pointer, clock }, dt) => {
    const k = Math.min(1, dt * 3.4);

    if (head.current) {
      head.current.rotation.y += (pointer.x * 0.44 - head.current.rotation.y) * k;
      head.current.rotation.x += (-pointer.y * 0.18 - head.current.rotation.x) * k;
      head.current.rotation.z += (-pointer.x * 0.06 - head.current.rotation.z) * k;
    }
    if (eyes.current) {
      eyes.current.position.x += (pointer.x * 0.028 - eyes.current.position.x) * k * 1.8;
      eyes.current.position.y += (-0.012 - pointer.y * 0.014 - eyes.current.position.y) * k * 1.8;
    }
    if (body.current) {
      body.current.rotation.y += (pointer.x * 0.12 - body.current.rotation.y) * k;
      body.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 1.1) * 0.007;
    }

    blink.current.next -= dt;
    if (blink.current.next <= 0) {
      blink.current.phase = 0.16;
      blink.current.next = 2.8 + Math.random() * 3.4;
    }
    if (blink.current.phase > 0) {
      blink.current.phase -= dt;
      const shut = Math.sin(Math.max(0, blink.current.phase / 0.16) * Math.PI);
      for (const lid of lids.current) if (lid) lid.scale.y = 1 - shut * 0.94;
    }
  });

  return (
    <group ref={body} position={position} scale={scale}>
      {/* Shirt */}
      <RoundedBox args={[0.66, 0.56, 0.38]} radius={0.17} smoothness={4} position={[0, 0.3, 0]}>
        <meshToonMaterial color={SHIRT} gradientMap={setRamp()} />
        <Ink weight="heavy" />
      </RoundedBox>

      {/* Apron, over the front of the shirt. */}
      <RoundedBox args={[0.4, 0.42, 0.06]} radius={0.05} smoothness={3} position={[0, 0.2, 0.18]}>
        <meshToonMaterial color={APRON} gradientMap={setRamp()} />
        <Ink weight="thin" />
      </RoundedBox>
      {/* Bib strap */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.14, 0.45, 0.17]} rotation={[0, 0, side * 0.22]}>
          <boxGeometry args={[0.055, 0.2, 0.03]} />
          <meshToonMaterial color={APRON} gradientMap={setRamp()} />
        </mesh>
      ))}
      {/* Pocket */}
      <RoundedBox args={[0.26, 0.11, 0.03]} radius={0.02} smoothness={3} position={[0, 0.11, 0.215]}>
        <meshToonMaterial color={APRON_TRIM} gradientMap={setRamp()} />
      </RoundedBox>
      {/* Name badge */}
      <RoundedBox args={[0.14, 0.06, 0.02]} radius={0.012} smoothness={3} position={[0.13, 0.4, 0.22]}>
        <meshToonMaterial color={GOLD} gradientMap={setRamp()} />
      </RoundedBox>

      {/* Collar */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.1, 0.55, 0.15]} rotation={[0.3, 0, side * 0.5]}>
          <boxGeometry args={[0.14, 0.11, 0.03]} />
          <meshToonMaterial color={SHIRT} gradientMap={setRamp()} />
        </mesh>
      ))}

      <group ref={head} position={[0, 0.76, 0.01]}>
        {/* Neck */}
        <mesh position={[0, -0.24, 0]}>
          <cylinderGeometry args={[0.09, 0.11, 0.18, 18]} />
          <meshToonMaterial color={SKIN} gradientMap={skinRamp()} />
        </mesh>

        {/* Skull */}
        <mesh scale={[0.94, 1.1, 0.94]}>
          <sphereGeometry args={[R, 34, 28]} />
          <meshToonMaterial color={SKIN} gradientMap={skinRamp()} />
          <Ink weight="heavy" />
        </mesh>

        {/* Jaw */}
        <RoundedBox args={[0.28, 0.2, 0.25]} radius={0.09} smoothness={4} position={[0, -0.19, 0.02]}>
          <meshToonMaterial color={SKIN} gradientMap={skinRamp()} />
        </RoundedBox>

        {/* Ears */}
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.26, -0.02, -0.01]} scale={[0.45, 1, 0.65]}>
            <sphereGeometry args={[0.075, 16, 14]} />
            <meshToonMaterial color={SKIN} gradientMap={skinRamp()} />
          </mesh>
        ))}

        {/* Hair: one inked cap, with un-inked bumps breaking its edge. */}
        <mesh position={[0, 0.16, -0.015]} scale={[1.02, 0.8, 1.02]}>
          <sphereGeometry args={[R, 30, 24]} />
          <meshToonMaterial color={HAIR} gradientMap={setRamp()} />
          <Ink weight="medium" />
        </mesh>
        {CURLS.map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[r, 14, 12]} />
            <meshToonMaterial color={HAIR} gradientMap={setRamp()} />
          </mesh>
        ))}

        {/* Brows */}
        {[-1, 1].map((side) => (
          <RoundedBox
            key={side}
            args={[0.13, 0.038, 0.04]}
            radius={0.017}
            smoothness={3}
            position={[side * 0.1, 0.06, R * 0.92]}
            rotation={[0, 0, side * 0.08]}
          >
            <meshToonMaterial color={HAIR} gradientMap={setRamp()} />
          </RoundedBox>
        ))}

        {/* Eyes */}
        <group ref={eyes} position={[0, -0.012, 0]}>
          {[-1, 1].map((side, i) => (
            <group key={side} position={[side * 0.098, 0, R * 0.95]}>
              <mesh
                ref={(node) => {
                  lids.current[i] = node;
                }}
                scale={[1.18, 0.64, 0.34]}
              >
                <sphereGeometry args={[0.042, 18, 14]} />
                <meshToonMaterial color={EYE} gradientMap={setRamp()} />
              </mesh>
              <mesh position={[side * 0.013, 0.011, 0.022]}>
                <sphereGeometry args={[0.011, 10, 8]} />
                <meshBasicMaterial color="#efe7db" toneMapped={false} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Nose */}
        <mesh position={[0, -0.085, R * 0.94]} scale={[0.5, 1.1, 0.55]}>
          <sphereGeometry args={[0.04, 16, 14]} />
          <meshToonMaterial color={SKIN} gradientMap={skinRamp()} />
        </mesh>

        {/* Mouth */}
        <RoundedBox
          args={[0.13, 0.028, 0.026]}
          radius={0.013}
          smoothness={3}
          position={[0, -0.168, R * 0.87]}
        >
          <meshToonMaterial color={LIP} gradientMap={skinRamp()} />
        </RoundedBox>
      </group>
    </group>
  );
}
