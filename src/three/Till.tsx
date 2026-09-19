import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instance, Instances } from '@react-three/drei';
import { DoubleSide, Group, Mesh, MeshStandardMaterial, PlaneGeometry, type Texture } from 'three';
import { palette } from './tokens';
import { setRamp } from './toon';
import { Ink } from './materials';
import { makeSpring, spring } from './spring';
import { input } from './hotspots';
import { sincePrint } from './tillState';
import { createDisplayTexture, createReceiptTexture } from './receiptTexture';

const ENAMEL = '#cdd5cf';
const ENAMEL_DARK = '#8b968f';
const HEAD = '#2b3135';
const BRASS = '#d7a54a';

/** Where the paper leaves the machine, and how much of it there is. */
// Offset to the left of centre, so the receipt hangs beside the figures on
// the display rather than straight down over them.
// In front of the roll lid, not under it — the paper has to appear to come
// from somewhere, and a stub emerging inside a chrome cover appears nowhere.
const SLOT = { x: -0.1, y: 0.5, z: 0.058 };
const PAPER_W = 0.21;
const PAPER_MAX = 0.5;
const SEGS = 18;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (v: number) => v * v * (3 - 2 * v);

/**
 * The paper.
 *
 * A flat strip whose vertices are rewritten every frame along a curve that
 * leaves the slot pointing up, turns over, and hangs down the front. The
 * length of that curve *is* the feed, so the receipt grows out of the machine
 * instead of being revealed by a mask — and the UVs are rewritten with it, at
 * a fixed physical scale, so lines appear as they are printed rather than the
 * whole receipt stretching as it comes.
 */
function Paper({ art }: { art: Texture | null }) {
  const mesh = useRef<Mesh>(null);
  const geometry = useMemo(() => new PlaneGeometry(PAPER_W, 1, 1, SEGS), []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  // Where the strip has got to, and the little bounce as the feed stops.
  const fed = useRef(makeSpring(0.14));

  useFrame(({ clock }, dt) => {
    const node = mesh.current;
    if (!node) return;

    const since = sincePrint(performance.now());
    // A stub waits in the slot until something is printed; then the motor runs
    // for a second and a half and leaves the receipt hanging.
    const target = since === null ? 0.14 : 0.14 + smooth(clamp01((since - 0.12) / 1.35)) * 0.86;
    spring(fed.current, target, dt, 150, 16);
    const feed = clamp01(fed.current.value);
    const length = Math.max(0.012, feed * PAPER_MAX);

    const running = since !== null && since > 0.1 && since < 1.5;
    const t = clock.elapsedTime;

    const pos = geometry.attributes.position;
    const uv = geometry.attributes.uv;
    const ds = length / SEGS;
    let y = 0;
    let z = 0;

    for (let k = 0; k <= SEGS; k += 1) {
      const s = k * ds;
      if (k > 0) {
        // Straight out of the slot, then a turn, then a hang.
        const phi = smooth(clamp01((s - 0.05) / 0.18)) * 2.52;
        y += Math.cos(phi) * ds;
        z += Math.sin(phi) * ds;
      }
      // The sheet is never flat: a slow wave, and a shudder while the motor
      // is actually pulling.
      const wave = Math.sin(t * 1.6 + s * 9) * 0.004 * (s / PAPER_MAX);
      const judder = running ? Math.sin(t * 46) * 0.0035 : 0;

      const row = SEGS - k;
      const v = (length - s) / PAPER_MAX;
      for (let col = 0; col < 2; col += 1) {
        const i = row * 2 + col;
        pos.setXYZ(i, (col === 0 ? -1 : 1) * (PAPER_W / 2), y + judder, z + wave);
        uv.setY(i, v);
      }
    }
    pos.needsUpdate = true;
    uv.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={mesh} geometry={geometry} position={[SLOT.x, SLOT.y, SLOT.z]}>
      {art ? (
        <meshToonMaterial key={art.uuid} map={art} gradientMap={setRamp()} side={DoubleSide} />
      ) : (
        <meshToonMaterial key="blank" color={palette.paper100()} gradientMap={setRamp()} side={DoubleSide} />
      )}
    </mesh>
  );
}

/**
 * The till: an enamelled register with a thermal printer on its back.
 *
 * It used to be a black glossy box with a yellow rectangle on it, which is not
 * a machine anyone can name. Everything here is a part that says what the
 * object does — a keypad you could press, a drawer that opens, a paper roll
 * under a chrome lid, a tear bar, and a lever. It is the one thing in the shop
 * a visitor is asked to operate, so it has to look operable.
 */
export function Till() {
  const [art, setArt] = useState<Texture | null>(null);
  const [display, setDisplay] = useState<Texture | null>(null);
  const lever = useRef<Group>(null);
  const drawer = useRef<Group>(null);
  const rollers = useRef<Group>(null);
  const lamp = useRef<Mesh>(null);
  const kick = useRef(makeSpring(0));
  const slide = useRef(makeSpring(0));
  const lastPrint = useRef(0);

  useEffect(() => {
    const receipt = createReceiptTexture();
    const screen = createDisplayTexture();
    setArt(receipt);
    setDisplay(screen);
    return () => {
      receipt?.dispose();
      screen?.dispose();
    };
  }, []);

  useFrame(({ clock }, dt) => {
    const now = performance.now();
    const since = sincePrint(now);
    const state = input('till');
    const active = state.hovered || state.focused;

    // One impulse per print, on the rising edge.
    if (since !== null && since < 0.08 && lastPrint.current !== Math.floor(now - since * 1000)) {
      lastPrint.current = Math.floor(now - since * 1000);
      kick.current.velocity += 16;
      slide.current.velocity += 2.4;
    }
    spring(kick.current, 0, dt, 40, 5);
    spring(slide.current, 0, dt, 70, 9);

    // Hovering makes it lean into the job rather than sit there.
    const ready = active ? 0.1 : 0;
    if (lever.current) lever.current.rotation.x = -kick.current.value * 0.9 - ready * 0.8;
    if (drawer.current) drawer.current.position.z = 0.245 + Math.max(0, slide.current.value) * 0.12;
    if (rollers.current) {
      const running = since !== null && since > 0.1 && since < 1.5;
      rollers.current.rotation.x -= (running ? 14 : active ? 1.1 : 0) * dt;
    }
    if (lamp.current) {
      // Green while it waits, and hammering while it prints.
      const busy = since !== null && since < 1.5;
      const m = lamp.current.material as MeshStandardMaterial;
      m.emissiveIntensity = busy
        ? 2 + Math.abs(Math.sin(clock.elapsedTime * 22)) * 3
        : 1.1 + Math.sin(clock.elapsedTime * 1.6) * 0.35;
    }
  });

  return (
    <group>
      {/* Carcass */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.62, 0.24, 0.48]} />
        <meshToonMaterial color={ENAMEL} gradientMap={setRamp()} />
        <Ink weight="thin" />
      </mesh>

      {/* Cash drawer, which jumps when the machine rings. */}
      <group ref={drawer} position={[0, 0.095, 0.245]}>
        <mesh>
          <boxGeometry args={[0.56, 0.13, 0.03]} />
          <meshToonMaterial color={ENAMEL_DARK} gradientMap={setRamp()} />
          <Ink weight="thin" />
        </mesh>
        <mesh position={[0, 0, 0.022]}>
          <boxGeometry args={[0.2, 0.026, 0.018]} />
          <meshPhysicalMaterial color="#c3c7cb" roughness={0.16} metalness={1} envMapIntensity={1.6} />
        </mesh>
      </group>

      {/* Keypad, raked up so you can see there are keys at all. */}
      <group position={[0, 0.265, 0.1]} rotation={[0.5, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.54, 0.028, 0.26]} />
          <meshToonMaterial color={ENAMEL} gradientMap={setRamp()} />
          <Ink weight="thin" />
        </mesh>
        {/* Eight keys, one draw call. They differ by a position and, for the
            total key, a colour — which is exactly what per-instance data is
            for, and eight separate meshes here was the single biggest thing
            this machine added to the frame. */}
        <Instances limit={8} range={8}>
          <cylinderGeometry args={[0.032, 0.032, 0.018, 10]} />
          <meshToonMaterial gradientMap={setRamp()} />
          {Array.from({ length: 8 }, (_, i) => (
            <Instance
              key={i}
              position={[-0.18 + (i % 4) * 0.12, 0.024, -0.055 + Math.floor(i / 4) * 0.085]}
              color={i === 7 ? BRASS : palette.paper100()}
            />
          ))}
        </Instances>
      </group>

      {/* The printer itself, in dark steel so it reads as a separate machine
          bolted to the register. */}
      <group position={[0, 0, -0.11]}>
        <mesh position={[0, 0.355, 0]}>
          <boxGeometry args={[0.5, 0.26, 0.26]} />
          <meshToonMaterial color={HEAD} gradientMap={setRamp()} />
          <Ink weight="thin" />
        </mesh>

        {/* Total window */}
        <mesh position={[0, 0.4, 0.132]}>
          <planeGeometry args={[0.36, 0.115]} />
          {display ? (
            <meshBasicMaterial key={display.uuid} map={display} toneMapped={false} />
          ) : (
            <meshBasicMaterial key="dark" color="#1b1408" />
          )}
        </mesh>

        {/* Paper roll under its chrome lid. */}
        <mesh position={[0, 0.505, -0.045]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.085, 0.085, 0.46, 14, 1, true, 0, Math.PI]} />
          <meshPhysicalMaterial
            color="#969da3"
            roughness={0.26}
            metalness={1}
            envMapIntensity={0.9}
            side={DoubleSide}
          />
        </mesh>

        {/* The bed: a dark recess with two feed rollers in it, turning. */}
        <mesh position={[SLOT.x, 0.5, 0.045]}>
          <boxGeometry args={[0.28, 0.03, 0.09]} />
          <meshBasicMaterial color="#0c0f11" />
        </mesh>
        <group ref={rollers} position={[SLOT.x, 0.495, 0.045]}>
          {[-0.03, 0.03].map((z) => (
            <mesh key={z} position={[0, 0, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.019, 0.019, 0.25, 8]} />
              <meshToonMaterial color={ENAMEL_DARK} gradientMap={setRamp()} />
            </mesh>
          ))}
        </group>

        {/* Tear bar. */}
        <mesh position={[0, 0.512, 0.098]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.42, 0.012, 0.035]} />
          <meshPhysicalMaterial color="#c9cdd1" roughness={0.2} metalness={1} envMapIntensity={1.6} />
        </mesh>

        <Paper art={art} />
      </group>

      {/* The lever. Nothing says register like a crank on the side, and it is
          what the machine throws when it prints. */}
      <group ref={lever} position={[0.33, 0.3, -0.06]}>
        <mesh position={[0, 0.09, 0.02]} rotation={[0.25, 0, 0.12]}>
          <cylinderGeometry args={[0.014, 0.014, 0.2, 8]} />
          <meshPhysicalMaterial color="#c3c7cb" roughness={0.2} metalness={1} envMapIntensity={1.6} />
        </mesh>
        <mesh position={[0.024, 0.185, 0.045]}>
          <sphereGeometry args={[0.035, 12, 10]} />
          <meshToonMaterial color={BRASS} gradientMap={setRamp()} />
          <Ink weight="thin" />
        </mesh>
      </group>

      {/* Ready lamp. */}
      <mesh ref={lamp} position={[-0.24, 0.19, 0.242]}>
        <sphereGeometry args={[0.018, 10, 8]} />
        <meshStandardMaterial color="#8ee6a8" emissive="#8ee6a8" emissiveIntensity={1.1} toneMapped={false} />
      </mesh>
    </group>
  );
}
