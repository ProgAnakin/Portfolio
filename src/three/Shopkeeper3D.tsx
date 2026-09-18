import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { Group, Mesh } from 'three';
import { Ink } from './materials';
import { setRamp, skinRamp } from './toon';

/** Head radius. Everything on the face is placed relative to this. */
const R = 0.3;

const SKIN = '#a4714c';
const HAIR = '#2b1f18';
const TEE = '#16120f';
const GOLD = '#d7a54a';
const EYE = '#241a14';
const LIP = '#94604c';

/**
 * The curls, as a silhouette rather than as hair.
 *
 * Volume piled on top and at the front, tightening to a close fade at the
 * temples — the shape does the recognising, so it has to be right before any
 * amount of detail helps. [x, y, z, radius]
 */
const CURLS: [number, number, number, number][] = [
  // Crown — a tall mass sitting above the skull, pulled inward so the
  // silhouette peaks instead of spreading into a helmet.
  [-0.1, 0.36, 0.02, 0.15],
  [0.08, 0.4, 0.0, 0.155],
  [0.19, 0.33, -0.03, 0.13],
  [-0.19, 0.33, -0.03, 0.13],
  [0.0, 0.38, 0.14, 0.14],
  [0.15, 0.34, 0.15, 0.115],
  [-0.15, 0.34, 0.14, 0.115],
  [0.02, 0.42, -0.14, 0.125],
  [-0.15, 0.35, -0.18, 0.11],
  [0.17, 0.35, -0.18, 0.11],
  [0.0, 0.33, -0.25, 0.115],
  // Fringe, stopping well clear of the brows.
  [-0.12, 0.22, 0.235, 0.1],
  [0.1, 0.23, 0.235, 0.095],
  [0.21, 0.21, 0.16, 0.085],
  [-0.22, 0.21, 0.15, 0.085],
  // The fade: barely proud of the skull, and it stops above the ear.
  [-0.24, 0.17, 0.02, 0.05],
  [0.24, 0.17, 0.02, 0.05],
  [-0.23, 0.2, -0.13, 0.053],
  [0.23, 0.2, -0.13, 0.053],
  [-0.12, 0.18, -0.26, 0.062],
  [0.12, 0.18, -0.26, 0.062],
];

/**
 * The shopkeeper.
 *
 * Cartoon proportions on purpose — the head is deliberately too big, which is
 * what lets a face read at the size it appears on screen. Cel-shaded and inked
 * like everything else in the room, so the character belongs to the drawing
 * rather than visiting it.
 *
 * The head follows the cursor, the eyes lead it slightly, and it blinks. Those
 * three things are the whole difference between a figure behind a counter and
 * a shop that is open.
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
  const lids = useRef<Mesh[]>([]);
  const blink = useRef({ next: 2.5, closing: 0 });

  const skin = useMemo(() => skinRamp(), []);
  const set = useMemo(() => setRamp(), []);

  useFrame(({ pointer, clock }, dt) => {
    const k = Math.min(1, dt * 3.6);
    const t = clock.getElapsedTime();

    if (head.current) {
      head.current.rotation.y += (pointer.x * 0.46 - head.current.rotation.y) * k;
      head.current.rotation.x += (-pointer.y * 0.2 - head.current.rotation.x) * k;
      // A small counter-tilt, so the head turns rather than swivels.
      head.current.rotation.z += (-pointer.x * 0.07 - head.current.rotation.z) * k;
    }
    if (eyes.current) {
      // Eyes arrive before the head does.
      eyes.current.position.x += (pointer.x * 0.045 - eyes.current.position.x) * k * 1.6;
      eyes.current.position.y += (-0.01 - pointer.y * 0.02 - eyes.current.position.y) * k * 1.6;
    }
    if (body.current) {
      body.current.rotation.y += (pointer.x * 0.12 - body.current.rotation.y) * k;
      body.current.position.y = position[1] + Math.sin(t * 1.1) * 0.006;
    }

    // Blink: a quick squash of the lids, at an uneven interval.
    blink.current.next -= dt;
    if (blink.current.next <= 0) {
      blink.current.closing = 0.16;
      blink.current.next = 3 + Math.random() * 3.5;
    }
    if (blink.current.closing > 0) {
      blink.current.closing -= dt;
      const phase = Math.max(0, blink.current.closing / 0.16);
      const shut = Math.sin(phase * Math.PI);
      for (const lid of lids.current) if (lid) lid.scale.y = 1 - shut * 0.92;
    }
  });

  return (
    <group ref={body} position={position} scale={scale}>
      {/* Torso — the black tee. */}
      <RoundedBox args={[0.68, 0.56, 0.4]} radius={0.17} smoothness={4} position={[0, 0.28, 0]}>
        <meshToonMaterial color={TEE} gradientMap={set} />
        <Ink weight="heavy" />
      </RoundedBox>

      {/* The chain. */}
      <mesh position={[0, 0.46, 0.03]} rotation={[-0.34, 0, 0]}>
        <torusGeometry args={[0.15, 0.011, 8, 32]} />
        <meshToonMaterial color={GOLD} gradientMap={set} />
      </mesh>

      <group ref={head} position={[0, 0.78, 0.02]}>
        {/* Neck */}
        <mesh position={[0, -0.26, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 0.2, 18]} />
          <meshToonMaterial color={SKIN} gradientMap={skin} />
          <Ink weight="thin" />
        </mesh>

        {/* Skull — a touch taller than wide, like the reference. */}
        <mesh scale={[0.9, 1.17, 0.92]}>
          <sphereGeometry args={[R, 36, 30]} />
          <meshToonMaterial color={SKIN} gradientMap={skin} />
          <Ink weight="heavy" />
        </mesh>

        {/* Jaw, squared off under the cheeks. */}
        <RoundedBox args={[0.3, 0.24, 0.27]} radius={0.1} smoothness={4} position={[0, -0.22, 0.02]}>
          <meshToonMaterial color={SKIN} gradientMap={skin} />
        </RoundedBox>

        {/* Ears, and the stud in the right one. */}
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.275, -0.02, -0.01]} scale={[0.45, 1, 0.65]}>
            <sphereGeometry args={[0.08, 16, 14]} />
            <meshToonMaterial color={SKIN} gradientMap={skin} />
          </mesh>
        ))}
        <mesh position={[-0.3, -0.085, 0.015]}>
          <sphereGeometry args={[0.022, 12, 10]} />
          <meshToonMaterial color={GOLD} gradientMap={set} />
        </mesh>

        {/* Brows — the strongest feature on the reference, so the strongest here. */}
        {[-1, 1].map((side) => (
          <RoundedBox
            key={side}
            args={[0.145, 0.042, 0.04]}
            radius={0.02}
            smoothness={3}
            position={[side * 0.108, 0.075, R * 0.93]}
            rotation={[0, 0, side * 0.09]}
          >
            <meshToonMaterial color={HAIR} gradientMap={set} />
          </RoundedBox>
        ))}

        {/* Eyes: dark almonds with a single catchlight. */}
        <group ref={eyes} position={[0, -0.01, 0]}>
          {[-1, 1].map((side, i) => (
            <group key={side} position={[side * 0.108, 0, R * 0.97]}>
              <mesh
                ref={(node) => {
                  if (node) lids.current[i] = node;
                }}
                scale={[1.2, 0.62, 0.34]}
              >
                <sphereGeometry args={[0.044, 20, 16]} />
                <meshToonMaterial color={EYE} gradientMap={set} />
              </mesh>
              <mesh position={[side * 0.014, 0.012, 0.022]}>
                <sphereGeometry args={[0.011, 10, 8]} />
                <meshBasicMaterial color="#ede6da" toneMapped={false} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Nose */}
        <mesh position={[0, -0.095, R * 0.95]} scale={[0.5, 1.1, 0.55]}>
          <sphereGeometry args={[0.042, 16, 14]} />
          <meshToonMaterial color={SKIN} gradientMap={skin} />
        </mesh>

        {/* Mouth, closed and level. */}
        <RoundedBox
          args={[0.14, 0.03, 0.028]}
          radius={0.014}
          smoothness={3}
          position={[0, -0.185, R * 0.88]}
        >
          <meshToonMaterial color={LIP} gradientMap={skin} />
        </RoundedBox>

        {/* Hair, inside the head group so it turns with it. */}
        {CURLS.map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[r, 14, 12]} />
            <meshToonMaterial color={HAIR} gradientMap={set} />
            {r > 0.1 && <Ink weight="thin" />}
          </mesh>
        ))}
      </group>

    </group>
  );
}
