import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { Group } from 'three';
import { palette } from './tokens';

const CURLS: [number, number, number, number][] = [
  [-0.15, 0.13, -0.03, 0.115],
  [0.02, 0.2, -0.04, 0.125],
  [0.17, 0.12, -0.03, 0.11],
  [0.21, -0.02, -0.05, 0.085],
  [-0.2, -0.01, -0.04, 0.088],
  [-0.08, 0.19, 0.05, 0.1],
  [0.1, 0.18, 0.06, 0.095],
  [0.2, -0.13, -0.06, 0.07],
  [-0.19, -0.14, -0.06, 0.068],
];

/**
 * The shopkeeper, in clay.
 *
 * Clay is the point: it takes light softly and has no highlight, so the figure
 * stays a silhouette with volume rather than becoming a character model. The
 * head tracks the cursor — the one piece of eye contact in the room, and the
 * reason the shop feels attended rather than abandoned.
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
  const { viewport } = useThree();
  const target = useRef({ x: 0, y: 0 });

  // Plain hex on purpose: three.js Color cannot parse color-mix(), and an
  // unparsed string silently leaves the material white.
  const skin = '#5b4937';
  const shirt = palette.ink900();

  useFrame(({ pointer }, dt) => {
    target.current.x = pointer.x;
    target.current.y = pointer.y;
    const k = Math.min(1, dt * 3.4);

    if (head.current) {
      // Looks where you are, but only so far — a neck, not a turret.
      head.current.rotation.y += (target.current.x * 0.5 - head.current.rotation.y) * k;
      head.current.rotation.x += (-target.current.y * 0.22 - head.current.rotation.x) * k;
    }
    if (body.current) {
      body.current.rotation.y += (target.current.x * 0.14 - body.current.rotation.y) * k;
      // A slow breath, so a still figure is not a frozen one.
      const t = performance.now() / 1000;
      body.current.position.y = position[1] + Math.sin(t * 1.1) * 0.006;
    }
  });

  void viewport;

  return (
    <group ref={body} position={position} scale={scale}>
      {/* Shoulders */}
      <RoundedBox args={[0.62, 0.52, 0.36]} radius={0.16} smoothness={4} position={[0, 0.26, 0]}>
        <meshStandardMaterial color={shirt} roughness={0.92} />
      </RoundedBox>

      <group ref={head} position={[0, 0.62, 0]}>
        {/* Neck */}
        <mesh position={[0, -0.13, 0]}>
          <cylinderGeometry args={[0.075, 0.09, 0.14, 16]} />
          <meshStandardMaterial color={skin} roughness={0.96} />
        </mesh>
        {/* Head */}
        <mesh>
          <sphereGeometry args={[0.185, 28, 24]} />
          <meshStandardMaterial color={skin} roughness={0.96} />
        </mesh>
        {/* Curls, deliberately uneven */}
        {CURLS.map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[r, 16, 14]} />
            <meshStandardMaterial color={shirt} roughness={0.98} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
