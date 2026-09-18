import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { Group, Object3D } from 'three';
import { palette } from './tokens';
import { makeSpring, spring } from './spring';
import { hotspotObjects, input, releaseHotspot } from './hotspots';
import { Shopkeeper3D } from './Shopkeeper3D';

export const COUNTER_X = 2.45;
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

      <Shopkeeper3D position={[0.24, TOP_Y + 0.58, -0.45]} scale={1.3} />

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

      {/* Telephone — rubber, so it reads soft next to the chrome till. */}
      <CounterProp id="telephone" position={[-0.86, TOP_Y, 0.14]}>
        {/* Sloped base with a dial, so it reads as a telephone and not a bar
            of soap — the silhouette has to do that work at this distance. */}
        <RoundedBox
          args={[0.44, 0.17, 0.34]}
          radius={0.045}
          smoothness={4}
          position={[0, 0.085, 0]}
          rotation={[-0.16, 0, 0]}
        >
          <meshPhysicalMaterial
            color={palette.prod('clay')}
            roughness={0.78}
            clearcoat={0.18}
            clearcoatRoughness={0.7}
            sheen={0.6}
            sheenColor="#ffffff"
          />
        </RoundedBox>
        {/* Rotary dial */}
        <mesh position={[0, 0.16, 0.055]} rotation={[-Math.PI / 2 - 0.16, 0, 0]}>
          <torusGeometry args={[0.082, 0.022, 10, 24]} />
          <meshStandardMaterial color={palette.ink900()} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.152, 0.052]} rotation={[-Math.PI / 2 - 0.16, 0, 0]}>
          <circleGeometry args={[0.062, 20]} />
          <meshStandardMaterial color={palette.paper500()} roughness={0.7} />
        </mesh>
        {/* Cradle prongs */}
        {[-0.15, 0.15].map((x) => (
          <mesh key={x} position={[x, 0.2, -0.02]}>
            <boxGeometry args={[0.05, 0.06, 0.09]} />
            <meshStandardMaterial color={palette.ink900()} roughness={0.6} />
          </mesh>
        ))}
        {/* Handset resting across them */}
        <group position={[0, 0.26, -0.02]}>
          <RoundedBox args={[0.42, 0.07, 0.08]} radius={0.033} smoothness={4}>
            <meshPhysicalMaterial color={palette.prod('clay')} roughness={0.72} clearcoat={0.24} />
          </RoundedBox>
          {[-0.17, 0.17].map((x) => (
            <RoundedBox key={x} args={[0.13, 0.11, 0.12]} radius={0.05} smoothness={4} position={[x, 0, 0]}>
              <meshPhysicalMaterial color={palette.prod('clay')} roughness={0.72} clearcoat={0.24} />
            </RoundedBox>
          ))}
        </group>
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
