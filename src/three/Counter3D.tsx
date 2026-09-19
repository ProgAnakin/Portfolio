import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Object3D } from 'three';
import { palette } from './tokens';
import { makeSpring, spring } from './spring';
import { hotspotObjects, input, releaseHotspot } from './hotspots';
import { Shopkeeper3D } from './Shopkeeper3D';
import { Telephone } from './Telephone';
import { CEILING_Y } from './Ceiling';
import { Pendant } from './Pendant';
import { Till } from './Till';

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

  return (
    <group position={[COUNTER_X, 0, 0.55]}>
      {/* The carcass. Slabs, so: plain boxes — but a joiner's counter is not
          one slab, and at this size it is the biggest plain surface left in
          the room. The panelling costs four boxes and does more for the craft
          of the shot than anything else here would. */}
      <mesh position={[0, 0.58, 0]}>
        <boxGeometry args={[2.5, 0.96, 0.92]} />
        <meshStandardMaterial color={oakDark} roughness={0.86} />
      </mesh>
      {/* Toe kick, set back, so the counter stands on something. */}
      <mesh position={[0, 0.05, -0.04]}>
        <boxGeometry args={[2.44, 0.1, 0.86]} />
        <meshStandardMaterial color={palette.ink800()} roughness={0.9} />
      </mesh>
      {/* Two recessed panels in the front face. */}
      {[-0.62, 0.62].map((x) => (
        <mesh key={x} position={[x, 0.6, 0.455]}>
          <boxGeometry args={[1.02, 0.66, 0.02]} />
          <meshStandardMaterial color="#66523d" roughness={0.8} />
        </mesh>
      ))}
      {[-0.62, 0.62].map((x) => (
        <mesh key={`inner${x}`} position={[x, 0.6, 0.462]}>
          <boxGeometry args={[0.92, 0.56, 0.02]} />
          <meshStandardMaterial color={oakDark} roughness={0.88} />
        </mesh>
      ))}
      {/* The top, and a brass lip under it catching the strip lights. */}
      <mesh position={[0, TOP_Y - 0.045, 0]}>
        <boxGeometry args={[2.66, 0.09, 1.04]} />
        <meshStandardMaterial color={oak} roughness={0.55} />
      </mesh>
      <mesh position={[0, TOP_Y - 0.105, 0.508]}>
        <boxGeometry args={[2.62, 0.026, 0.03]} />
        <meshStandardMaterial color="#c79a48" roughness={0.3} metalness={0.9} envMapIntensity={1.4} />
      </mesh>

      <Shopkeeper3D position={[0.2, TOP_Y - 0.42, -0.52]} scale={1.35} />

      {/* Pendant: the fixture, and the bulb doing the lighting. It hangs from
          the ceiling rather than from this group, so the pivot is where the
          rose is and the swing is a swing. */}
      <Pendant position={[-0.78, CEILING_Y, 0.16]} />

      {/* Telephone: the door marked "talk to a person". */}
      <CounterProp id="telephone" position={[-0.86, TOP_Y, 0.14]}>
        <Telephone />
      </CounterProp>

      {/* The till: the one machine a visitor is asked to operate. */}
      <CounterProp id="till" position={[0.88, TOP_Y, 0.1]}>
        <Till />
      </CounterProp>
    </group>
  );
}
