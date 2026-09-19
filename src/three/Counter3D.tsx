import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Object3D } from 'three';
import { palette } from './tokens';
import { makeSpring, spring } from './spring';
import { hotspotObjects, input, releaseHotspot } from './hotspots';
import { Shopkeeper3D } from './Shopkeeper3D';
import { Telephone } from './Telephone';
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
      {/* Block and top. Slabs, so: plain boxes. */}
      <mesh position={[0, 0.53, 0]}>
        <boxGeometry args={[2.5, 1.06, 0.92]} />
        <meshStandardMaterial color={oakDark} roughness={0.86} />
      </mesh>
      <mesh position={[0, TOP_Y - 0.045, 0]}>
        <boxGeometry args={[2.66, 0.09, 1.04]} />
        <meshStandardMaterial color={oak} roughness={0.55} />
      </mesh>

      <Shopkeeper3D position={[0.2, TOP_Y - 0.42, -0.52]} scale={1.35} />

      {/* Pendant: the fixture, and the bulb doing the lighting. It hangs from
          the ceiling rather than from this group, so the pivot is where the
          rose is and the swing is a swing. */}
      <Pendant position={[-0.78, 3.46, 0.16]} />

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
