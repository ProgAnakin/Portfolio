import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector2, Vector3 } from 'three';
import { palette } from './tokens';
import { pendulum, PENDANT_DROP } from './pendulum';

/** How close, in screen space, the cursor has to pass to catch the shade. */
const REACH = 0.17;

/**
 * The pendant over the counter, on a real pendulum.
 *
 * It hangs from a pivot at the ceiling and swings on two axes with a restoring
 * force and damping, which is the whole model — no keyframes, so it is never
 * doing the same thing twice. The cursor knocks it: the shade is projected to
 * screen space each frame, and a pointer that crosses near it hands over a
 * share of its own velocity, so brushing past gives it a shove and swiping
 * through gives it a proper shunt. Left alone it keeps a slow draught going,
 * because a lamp that is perfectly still is a lamp nobody hung.
 */
export function Pendant({ position }: { position: [number, number, number] }) {
  const arm = useRef<Group>(null);
  const shade = useRef<Group>(null);
  const scratch = useMemo(
    () => ({ last: new Vector2(), world: new Vector3(), seeded: false }),
    [],
  );
  const angle = useRef({ x: 0, z: 0 });
  const velocity = useRef({ x: 0, z: 0 });

  useFrame(({ pointer, camera, clock }, dt) => {
    if (!arm.current || !shade.current) return;
    const step = Math.min(dt, 1 / 30);

    // What the cursor did this frame, and how near the shade it did it.
    const { last, world } = scratch;
    const dx = scratch.seeded ? pointer.x - last.x : 0;
    const dy = scratch.seeded ? pointer.y - last.y : 0;
    last.set(pointer.x, pointer.y);
    scratch.seeded = true;

    shade.current.getWorldPosition(world);
    world.project(camera);
    const reach = Math.hypot(pointer.x - world.x, pointer.y - world.y);
    if (reach < REACH) {
      const near = 1 - reach / REACH;
      // A push, plus a nudge just for being there, so a slow hover still
      // disturbs it rather than needing a swipe to do anything at all.
      velocity.current.z += (dx * 21 + Math.sign(dx || 1) * 0.1) * near;
      velocity.current.x += (-dy * 15 - 0.07) * near;
    }

    // Pendulum: restoring force, damping, and a draught that never settles.
    const t = clock.elapsedTime;
    const draught = 0.07;
    velocity.current.z += (-Math.sin(angle.current.z) * 17 + Math.sin(t * 0.7) * draught) * step;
    velocity.current.x += (-Math.sin(angle.current.x) * 17 + Math.sin(t * 0.53 + 2) * draught) * step;
    velocity.current.z *= Math.exp(-1.15 * step);
    velocity.current.x *= Math.exp(-1.15 * step);
    // Capped: past about this the shade swings clear out of its own pocket in
    // the composition and disappears behind the board on the wall.
    angle.current.z = Math.max(-0.18, Math.min(0.18, angle.current.z + velocity.current.z * step));
    angle.current.x = Math.max(-0.18, Math.min(0.18, angle.current.x + velocity.current.x * step));

    arm.current.rotation.z = angle.current.z;
    arm.current.rotation.x = angle.current.x;
    // The shade lags the cord by a hair, the way a heavy shade does.
    shade.current.rotation.z = -angle.current.z * 0.28;
    shade.current.rotation.x = -angle.current.x * 0.28;

    pendulum.tiltX = angle.current.x;
    pendulum.tiltZ = angle.current.z;
  });

  const amber = palette.amber300();

  return (
    <group position={position}>
      {/* The rose: what the flex is screwed to. Without it the cord arrives at
          the ceiling and stops, which is the join this was all built to hide. */}
      <mesh position={[0, -0.012, 0]}>
        <cylinderGeometry args={[0.17, 0.2, 0.05, 20]} />
        <meshStandardMaterial color="#8b8478" roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.035, 0]}>
        <torusGeometry args={[0.115, 0.016, 6, 20]} />
        <meshStandardMaterial color="#79736a" roughness={0.75} />
      </mesh>

      <group ref={arm}>
        {/* Flex, from the ceiling rose down to the shade. */}
        <mesh position={[0, -PENDANT_DROP / 2 + 0.06, 0]}>
          <cylinderGeometry args={[0.008, 0.008, PENDANT_DROP - 0.12, 6]} />
          <meshStandardMaterial color={palette.ink600()} roughness={0.6} />
        </mesh>
        <group ref={shade} position={[0, -PENDANT_DROP + 0.06, 0]}>
          <mesh>
            <coneGeometry args={[0.3, 0.26, 18, 1, true]} />
            <meshStandardMaterial
              color={palette.ink600()}
              roughness={0.42}
              metalness={0.5}
              side={2}
            />
          </mesh>
          <mesh position={[0, -0.1, 0]}>
            <sphereGeometry args={[0.075, 14, 10]} />
            <meshStandardMaterial
              color={amber}
              emissive={amber}
              emissiveIntensity={3.4}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
