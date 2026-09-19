import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { Group, InstancedMesh, Object3D, Vector3 } from 'three';
import { palette } from './tokens';
import { setRamp } from './toon';
import { Ink } from './materials';
import { makeSpring, spring } from './spring';
import { input } from './hotspots';

const SHELL = '#e8dabd';
const SHELL_DARK = '#8b7c62';
const CORD = '#332b24';
const GOLD = '#d7a54a';

/** Links in the coil. Enough that the rings touch and read as one cord. */
const LINKS = 34;

/** Where the handset rests, and where the cord disappears into the base. */
const HANDSET_Y = 0.252;
const CORD_START = new Vector3(-0.2, 0.235, -0.06);
const CORD_END = new Vector3(-0.16, 0.035, -0.15);

/**
 * The coiled cord.
 *
 * A cord is the one part of a telephone that is never still, so this one is
 * not modelled — it is drawn every frame. Thirty-odd rings are laid along a
 * quadratic curve whose control point drifts on three different periods, and
 * each ring is turned to face along the curve, so the coil twists as it swings
 * instead of sliding about as one rigid object. One instanced draw call and no
 * allocation per frame: it costs about what the seven static rings it replaces
 * cost, and those never moved.
 *
 * The top of the curve is wherever the handset currently is, so lifting the
 * handset pulls the cord up with it rather than leaving it hanging in the air.
 */
function Cord({ handset }: { handset: React.RefObject<Group | null> }) {
  const mesh = useRef<InstancedMesh>(null);
  const scratch = useMemo(
    () => ({
      dummy: new Object3D(),
      from: new Vector3(),
      control: new Vector3(),
      point: new Vector3(),
      ahead: new Vector3(),
    }),
    [],
  );
  const swing = useRef(makeSpring(0));
  const wasActive = useRef(false);

  // B(t) for a quadratic Bézier, written into `out` so nothing allocates.
  const at = (t: number, out: Vector3) => {
    const { from, control } = scratch;
    const u = 1 - t;
    out.set(
      u * u * from.x + 2 * u * t * control.x + t * t * CORD_END.x,
      u * u * from.y + 2 * u * t * control.y + t * t * CORD_END.y,
      u * u * from.z + 2 * u * t * control.z + t * t * CORD_END.z,
    );
    return out;
  };

  useFrame(({ clock }, dt) => {
    const node = mesh.current;
    if (!node) return;

    const state = input('telephone');
    const active = state.hovered || state.focused;

    // A kick on the way in rather than a value held while hovering: the cord
    // should swing because the handset just moved, and then settle.
    if (active && !wasActive.current) swing.current.velocity += 8;
    wasActive.current = active;
    spring(swing.current, 0, dt, 24, 3);

    const t = clock.elapsedTime;
    const sway = swing.current.value;

    const { dummy, from, control, point, ahead } = scratch;
    from.copy(CORD_START);
    // Only the handset's *travel*, not its resting height — adding the whole
    // position is how a cord ends up standing over the phone like an aerial.
    if (handset.current) from.y += handset.current.position.y - HANDSET_Y;

    // The belly of the cord, out to the left and resting near the counter.
    control.set(
      -0.58 + Math.sin(t * 0.9) * 0.016 - sway * 0.025,
      -0.08 + Math.sin(t * 1.7) * 0.014 + sway * 0.055,
      -0.05 + Math.sin(t * 1.3 + 1) * 0.032 + sway * 0.07,
    );

    for (let i = 0; i < LINKS; i += 1) {
      const u = i / (LINKS - 1);
      at(u, point);
      at(Math.min(1, u + 0.02), ahead);
      // The counter is solid. A cord that sags through it on the low part of
      // its swing is the same bug as a box through a plank, one prop over.
      point.y = Math.max(point.y, 0.022);
      ahead.y = Math.max(ahead.y, 0.022);
      dummy.position.copy(point);
      // A torus is drawn around +Z, so aiming +Z along the curve threads the
      // rings onto it. At the far end `ahead` collapses onto `point`, so nudge
      // it rather than hand `lookAt` a zero-length direction.
      if (ahead.distanceToSquared(point) < 1e-8) ahead.z += 0.001;
      dummy.lookAt(ahead);
      dummy.updateMatrix();
      node.setMatrixAt(i, dummy.matrix);
    }
    node.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, LINKS]} frustumCulled={false}>
      <torusGeometry args={[0.019, 0.0072, 5, 10]} />
      <meshToonMaterial color={CORD} gradientMap={setRamp()} />
    </instancedMesh>
  );
}

/**
 * The dial, and its return.
 *
 * Hovering winds it and lets go. The spring is left underdamped on purpose so
 * it unwinds past zero and settles: a rotary dial is a governed spring, and
 * that unwinding is the whole reason anyone remembers these phones.
 */
function Dial() {
  const wheel = useRef<Group>(null);
  const wind = useRef(makeSpring(0));
  const wasActive = useRef(false);

  useFrame((_, dt) => {
    if (!wheel.current) return;
    const state = input('telephone');
    const active = state.hovered || state.focused;
    if (active && !wasActive.current) {
      wind.current.value = 1.2;
      wind.current.velocity = 0;
    }
    wasActive.current = active;
    spring(wind.current, 0, dt, 58, 5.2);
    wheel.current.rotation.y = wind.current.value;
  });

  return (
    <group>
      {/* Number plate: stays put while the finger wheel turns over it. */}
      <mesh position={[0, 0.004, 0]}>
        <cylinderGeometry args={[0.108, 0.108, 0.014, 24]} />
        <meshToonMaterial color={SHELL_DARK} gradientMap={setRamp()} />
      </mesh>

      <group ref={wheel}>
        <mesh position={[0, 0.014, 0]}>
          <cylinderGeometry args={[0.098, 0.098, 0.016, 24]} />
          <meshToonMaterial color={palette.ink800()} gradientMap={setRamp()} />
        </mesh>
        <mesh position={[0, 0.023, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.08, 0.009, 5, 20]} />
          <meshToonMaterial color={GOLD} gradientMap={setRamp()} />
        </mesh>
        {/* Ten finger holes, opened through the wheel. */}
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 1.7 - 0.36;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.059, 0.026, Math.sin(a) * 0.059]}>
              <cylinderGeometry args={[0.0155, 0.0155, 0.012, 8]} />
              <meshToonMaterial color={SHELL} gradientMap={setRamp()} />
            </mesh>
          );
        })}
        <mesh position={[0, 0.026, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.014, 12]} />
          <meshToonMaterial color={SHELL} gradientMap={setRamp()} />
        </mesh>
      </group>

      {/* Finger stop: the brass hook the wheel is pulled round to. Fixed to
          the body and not to the wheel, which is the whole point of it. */}
      <mesh position={[0.098, 0.026, 0.042]} rotation={[0, -0.55, 0]}>
        <boxGeometry args={[0.05, 0.022, 0.02]} />
        <meshToonMaterial color={GOLD} gradientMap={setRamp()} />
      </mesh>
    </group>
  );
}

/**
 * A cream desk phone.
 *
 * It is the warmest object in the room and the one a stranger is meant to
 * reach for, so it gets the detail budget: a dial angled up off the body so it
 * reads from across the shop rather than presenting its edge to the camera, a
 * handset that lifts when you come near, and a cord that never stops moving.
 * A dark object on this counter would read as a hole in it.
 */
export function Telephone() {
  const handset = useRef<Group>(null);
  const hop = useRef(makeSpring(0));

  useFrame((_, dt) => {
    if (!handset.current) return;
    const state = input('telephone');
    const active = state.hovered || state.focused;
    spring(hop.current, active ? 0.042 : 0, dt, 200, 10.5);
    handset.current.position.y = HANDSET_Y + hop.current.value;
    handset.current.rotation.z = 0.02 - hop.current.value * 0.6;
  });

  return (
    <group>
      {/* Plinth, a shade darker, so the cream shell lands on something. */}
      <mesh position={[0, 0.018, -0.02]}>
        <boxGeometry args={[0.45, 0.036, 0.4]} />
        <meshToonMaterial color={SHELL_DARK} gradientMap={setRamp()} />
        <Ink weight="thin" />
      </mesh>

      {/* The body is two parts, and that is the whole design: a block at the
          back to carry the cradle, and a deck raked up in front of it.
          A desk phone seen from standing height is a dial you cannot see, so
          the deck is pitched at the room — and it has to sit *in front of* the
          block rather than inside it, or all you get is the lip. */}
      <RoundedBox
        args={[0.44, 0.17, 0.21]}
        radius={0.04}
        smoothness={2}
        position={[0, 0.105, -0.115]}
        rotation={[-0.08, 0, 0]}
      >
        <meshToonMaterial color={SHELL} gradientMap={setRamp()} />
        <Ink weight="thin" />
      </RoundedBox>

      <group position={[0, 0.098, 0.085]} rotation={[0.78, 0, 0]}>
        <RoundedBox args={[0.43, 0.035, 0.29]} radius={0.016} smoothness={2}>
          <meshToonMaterial color={SHELL} gradientMap={setRamp()} />
          <Ink weight="thin" />
        </RoundedBox>
        <group position={[0, 0.022, 0]}>
          <Dial />
        </group>
      </group>

      {/* Cradle prongs */}
      {[-0.13, 0.13].map((x) => (
        <mesh key={x} position={[x, 0.2, -0.115]} rotation={[0.1, 0, 0]}>
          <cylinderGeometry args={[0.028, 0.034, 0.06, 10]} />
          <meshToonMaterial color={SHELL_DARK} gradientMap={setRamp()} />
        </mesh>
      ))}

      {/* Handset: a tapered bar with the ear and mouth pieces turned in. */}
      <group ref={handset} position={[0, HANDSET_Y, -0.11]} rotation={[0, 0, 0.02]}>
        <RoundedBox args={[0.29, 0.052, 0.058]} radius={0.024} smoothness={2}>
          <meshToonMaterial color={SHELL} gradientMap={setRamp()} />
          <Ink weight="thin" />
        </RoundedBox>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.168, -0.014, 0.004]} rotation={[0, 0, side * 0.3]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.058, 0.047, 0.058, 14]} />
              <meshToonMaterial color={SHELL} gradientMap={setRamp()} />
              <Ink weight="thin" />
            </mesh>
            {/* A moulded groove round the cup. Two dark discs here instead
                read as a pair of eyes, which is not the object. */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.049, 0.005, 4, 14]} />
              <meshToonMaterial color={SHELL_DARK} gradientMap={setRamp()} />
            </mesh>
          </group>
        ))}
      </group>

      <Cord handset={handset} />
    </group>
  );
}
