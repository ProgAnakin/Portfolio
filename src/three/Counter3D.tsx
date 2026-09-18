import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { Group, Object3D } from 'three';
import { palette } from './tokens';
import { makeSpring, spring } from './spring';
import { hotspotObjects, input, releaseHotspot } from './hotspots';
import { Ink } from './materials';
import { setRamp } from './toon';
import { Shopkeeper3D } from './Shopkeeper3D';

export const COUNTER_X = 2.45;

const PHONE = '#ded0b4';
const PHONE_DARK = '#8e7f66';
const GOLD = '#d7a54a';
const TOP_Y = 1.12;

/**
 * A thing on the counter you can press.
 *
 * It registers an anchor for the DOM layer to track and reads its hover state
 * back from the shared record — same contract as a product on a shelf.
 */
function CounterProp({
  id,
  position,
  children,
}: {
  id: string;
  position: [number, number, number];
  children: React.ReactNode;
}) {
  const group = useRef<Group>(null);
  const anchor = useRef<Object3D>(null);
  const lift = useRef(makeSpring(0));
  const tilt = useRef(makeSpring(0));

  useEffect(() => {
    const node = anchor.current;
    if (node) hotspotObjects.set(id, node);
    return () => releaseHotspot(id);
  }, [id]);

  useFrame((_, dt) => {
    if (!group.current) return;
    const state = input(id);
    const active = state.hovered || state.focused;
    spring(lift.current, active ? 0.06 : 0, dt, 260, 13);
    spring(tilt.current, active ? 0.16 : 0, dt, 180, 12);
    group.current.position.y = position[1] + lift.current.value;
    group.current.rotation.y = tilt.current.value;
  });

  return (
    <group ref={group} position={position}>
      {children}
      <object3D ref={anchor} position={[0, 0.2, 0.16]} />
    </group>
  );
}

export function Counter3D() {
  const oak = palette.oak500();
  const oakDark = palette.oak700();
  const amber = palette.amber300();

  return (
    <group position={[COUNTER_X, 0, 0.55]}>
      {/* Block and top */}
      <RoundedBox args={[2.5, 1.06, 0.92]} radius={0.03} smoothness={2} position={[0, 0.53, 0]}>
        <meshStandardMaterial color={oakDark} roughness={0.86} />
      </RoundedBox>
      <RoundedBox args={[2.66, 0.09, 1.04]} radius={0.02} smoothness={3} position={[0, TOP_Y - 0.045, 0]}>
        <meshStandardMaterial color={oak} roughness={0.55} />
      </RoundedBox>

      <Shopkeeper3D position={[0.2, TOP_Y - 0.46, -0.52]} scale={1.22} />

      {/* Pendant: the fixture, and the bulb doing the lighting. */}
      <group position={[-0.78, 2.36, 0.16]}>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 1.1, 8]} />
          <meshStandardMaterial color={palette.ink600()} roughness={0.6} />
        </mesh>
        <mesh>
          <coneGeometry args={[0.3, 0.26, 24, 1, true]} />
          <meshStandardMaterial color={palette.ink600()} roughness={0.42} metalness={0.5} side={2} />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <sphereGeometry args={[0.075, 18, 16]} />
          <meshStandardMaterial
            color={amber}
            emissive={amber}
            emissiveIntensity={3.4}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Telephone: a cream desk phone, because a dark object on a dark
          counter is a hole. Dial, cradle, handset and a coiled cord — the
          silhouette has to say "telephone" before anyone hovers it. */}
      <CounterProp id="telephone" position={[-0.86, TOP_Y, 0.14]}>
        {/* Sloped base */}
        <RoundedBox
          args={[0.44, 0.15, 0.36]}
          radius={0.05}
          smoothness={4}
          position={[0, 0.075, 0]}
          rotation={[-0.14, 0, 0]}
        >
          <meshToonMaterial color={PHONE} gradientMap={setRamp()} />
          <Ink weight="thin" />
        </RoundedBox>

        {/* Rotary dial, with finger holes. */}
        <group position={[0, 0.155, 0.06]} rotation={[-Math.PI / 2 - 0.14, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.095, 0.095, 0.016, 28]} />
            <meshToonMaterial color={PHONE_DARK} gradientMap={setRamp()} />
          </mesh>
          <mesh position={[0, 0.011, 0]}>
            <torusGeometry args={[0.078, 0.012, 10, 28]} />
            <meshToonMaterial color={GOLD} gradientMap={setRamp()} />
          </mesh>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 1.6 - 0.5;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.055, 0.014, Math.sin(a) * 0.055]}>
                <cylinderGeometry args={[0.014, 0.014, 0.01, 10]} />
                <meshToonMaterial color={palette.ink900()} gradientMap={setRamp()} />
              </mesh>
            );
          })}
        </group>

        {/* Cradle prongs */}
        {[-0.155, 0.155].map((x) => (
          <mesh key={x} position={[x, 0.185, -0.04]}>
            <boxGeometry args={[0.05, 0.05, 0.1]} />
            <meshToonMaterial color={PHONE_DARK} gradientMap={setRamp()} />
          </mesh>
        ))}

        {/* Handset */}
        <group position={[0, 0.245, -0.04]} rotation={[0, 0, 0.02]}>
          <RoundedBox args={[0.42, 0.06, 0.07]} radius={0.028} smoothness={4}>
            <meshToonMaterial color={PHONE} gradientMap={setRamp()} />
            <Ink weight="thin" />
          </RoundedBox>
          {[-0.18, 0.18].map((x) => (
            <RoundedBox
              key={x}
              args={[0.13, 0.1, 0.11]}
              radius={0.045}
              smoothness={4}
              position={[x, -0.005, 0]}
            >
              <meshToonMaterial color={PHONE} gradientMap={setRamp()} />
              <Ink weight="thin" />
            </RoundedBox>
          ))}
        </group>

        {/* Coiled cord, running off the back. */}
        {Array.from({ length: 7 }, (_, i) => (
          <mesh
            key={i}
            position={[-0.24 - i * 0.032, 0.11 - i * 0.004, -0.12 - i * 0.012]}
            rotation={[0, 0.3, Math.PI / 2]}
          >
            <torusGeometry args={[0.028, 0.008, 8, 16]} />
            <meshToonMaterial color={PHONE_DARK} gradientMap={setRamp()} />
          </mesh>
        ))}
      </CounterProp>

      {/* The till — the only chrome in the shop, so it reflects the strips. */}
      <CounterProp id="till" position={[0.88, TOP_Y, 0.1]}>
        <RoundedBox args={[0.6, 0.42, 0.46]} radius={0.04} smoothness={4} position={[0, 0.21, 0]}>
          <meshPhysicalMaterial color="#b9bcc0" roughness={0.11} metalness={1} clearcoat={0.4} envMapIntensity={1.7} />
        </RoundedBox>
        <RoundedBox args={[0.44, 0.2, 0.1]} radius={0.025} smoothness={3} position={[0, 0.5, -0.1]}>
          <meshStandardMaterial color={palette.ink700()} roughness={0.3} metalness={0.7} />
        </RoundedBox>
        {/* Amber digits in the window */}
        <mesh position={[0, 0.5, -0.043]}>
          <planeGeometry args={[0.3, 0.1]} />
          <meshStandardMaterial
            color={amber}
            emissive={amber}
            emissiveIntensity={1.7}
            toneMapped={false}
          />
        </mesh>
        {/* Paper waiting in the slot */}
        <mesh position={[0, 0.425, 0.12]} rotation={[-Math.PI / 2.1, 0, 0]}>
          <planeGeometry args={[0.3, 0.16]} />
          <meshStandardMaterial color={palette.paper100()} roughness={0.9} side={2} />
        </mesh>
        <mesh position={[0, 0.06, 0.232]}>
          <boxGeometry args={[0.5, 0.1, 0.02]} />
          <meshStandardMaterial color={palette.ink600()} roughness={0.5} metalness={0.4} />
        </mesh>
      </CounterProp>
    </group>
  );
}
