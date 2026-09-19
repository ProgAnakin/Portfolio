import { RoundedBox } from '@react-three/drei';
import type { Texture } from 'three';
import type { ProductFinish, ProductShape } from '../../data/projects';
import { Ink, ToyMaterial } from '../materials';
import { labelRamp, setRamp } from '../toon';
import { palette } from '../tokens';

export interface ShapeProps {
  finish: ProductFinish;
  color: string;
  label: Texture | null;
  /** The status roundel, when the thing is not finished. */
  sticker: Texture | null;
  /**
   * The one prop that belongs to this shape — the kiosk's quiz card, the
   * boxed set's ball. Blank props read as labels nobody printed.
   */
  accessory: Texture | null;
  lit: boolean;
}

/**
 * A sticker, applied by hand and therefore crooked.
 *
 * Each shape places its own, because where a sticker lands depends on where
 * the flat is: on a box it goes across a corner, on a screen it goes on the
 * bezel. Always proud of the surface it sits on, so it never z-fights.
 */
function Sticker({
  sticker,
  position,
  size,
  rotation = [0, 0, -0.22],
}: {
  sticker: Texture;
  position: [number, number, number];
  size: number;
  rotation?: [number, number, number];
}) {
  return (
    <mesh key={sticker.uuid} position={position} rotation={rotation}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={sticker} transparent alphaTest={0.08} toneMapped={false} />
    </mesh>
  );
}

/** The printed face of a box. Flat, bright, and always readable. */
function PrintedFace({
  label,
  position,
  size,
  rotation,
}: {
  label: Texture;
  position: [number, number, number];
  size: [number, number];
  rotation?: [number, number, number];
}) {
  return (
    <mesh key={label.uuid} position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshToonMaterial map={label} gradientMap={labelRamp()} />
    </mesh>
  );
}

/**
 * Suaipe: a kiosk tablet on a weighted stand, tipped back the way a real one
 * is, with a quiz card caught mid-swipe in front of the screen. The card is
 * what says *what the thing does* from across the room.
 */
function Kiosk({ finish, color, label, sticker, accessory, lit }: ShapeProps) {
  return (
    <group>
      {/* Weighted base */}
      <RoundedBox args={[0.42, 0.055, 0.3]} radius={0.022} smoothness={3} position={[0, 0.028, 0]}>
        <ToyMaterial finish={finish} color={color} />
        <Ink weight="thin" />
      </RoundedBox>
      {/* Column */}
      <mesh position={[0, 0.17, -0.02]} rotation={[0.1, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.055, 0.26, 20]} />
        <ToyMaterial finish={finish} color={color} />
        <Ink weight="thin" />
      </mesh>

      {/* The tablet, tipped back. */}
      <group position={[0, 0.58, 0.02]} rotation={[-0.16, 0, 0]}>
        <RoundedBox args={[0.5, 0.62, 0.075]} radius={0.028} smoothness={4}>
          <ToyMaterial finish={finish} color={color} />
          <Ink />
        </RoundedBox>
        {label && (
          <mesh key={label.uuid} position={[0, 0, 0.04]}>
            <planeGeometry args={[0.41, 0.53]} />
            <meshBasicMaterial map={label} toneMapped={false} color={lit ? '#ffffff' : '#8c8378'} />
          </mesh>
        )}
        {sticker && <Sticker sticker={sticker} position={[-0.17, -0.2, 0.046]} size={0.26} />}

        {/* The card being swiped off the deck. */}
        <group position={[0.2, -0.2, 0.075]} rotation={[0, 0.14, -0.4]}>
          <RoundedBox args={[0.16, 0.21, 0.016]} radius={0.012} smoothness={3}>
            <meshToonMaterial color="#ffffff" gradientMap={labelRamp()} />
            <Ink weight="thin" />
          </RoundedBox>
          {accessory && (
            <mesh key={accessory.uuid} position={[0, 0, 0.0095]}>
              <planeGeometry args={[0.155, 0.204]} />
              <meshBasicMaterial map={accessory} toneMapped={false} color={lit ? '#ffffff' : '#9c948a'} />
            </mesh>
          )}
        </group>
      </group>
    </group>
  );
}

/**
 * Kouci: a deep boxed set leaning back on the shelf so its top face shows,
 * with the ball out of the box in front of it — a display, not a stack.
 */
function BoxedSet({ finish, color, label, sticker, accessory }: ShapeProps) {
  return (
    <group>
      <group position={[0, 0.32, -0.05]} rotation={[-0.11, 0.18, 0]}>
        <RoundedBox args={[0.5, 0.64, 0.24]} radius={0.016} smoothness={4}>
          <ToyMaterial finish={finish} color={color} />
          <Ink />
        </RoundedBox>
        {label && <PrintedFace label={label} position={[0, 0, 0.122]} size={[0.47, 0.61]} />}
        {sticker && <Sticker sticker={sticker} position={[0.13, -0.18, 0.128]} size={0.27} />}
        {/* Spine, so the box reads as a box from any angle. */}
        <mesh position={[-0.251, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.22, 0.6]} />
          <meshToonMaterial color={palette.ink900()} gradientMap={labelRamp()} opacity={0.5} transparent />
        </mesh>
      </group>

      {/* The ball, out of the box — panelled and gripped, so it reads as a
          ball rather than as a dot someone forgot to print. */}
      <mesh position={[0.28, 0.1, 0.16]} rotation={[0.3, 0.6, 0.2]}>
        <sphereGeometry args={[0.1, 28, 22]} />
        {accessory ? (
          <meshToonMaterial key={accessory.uuid} map={accessory} gradientMap={labelRamp()} />
        ) : (
          <meshToonMaterial key="plain" color={palette.amber400()} gradientMap={labelRamp()} />
        )}
        <Ink weight="thin" />
      </mesh>
    </group>
  );
}

/**
 * Sales Call Trainer: a shipping box caught mid-pack, side flaps thrown open
 * and the headset still sitting in it. The status is the object — you can see
 * the thing isn't finished because you can see it isn't out of the box yet.
 *
 * It is deliberately the squattest thing in the shop. It lives on the middle
 * shelf, where the strip light under the plank above is the real ceiling, and
 * every dimension here is chosen to clear it at full stretch. `shapeHeight`
 * records the top of the headband — change one, change the other.
 */
function Crate({ finish, color, label, sticker }: ShapeProps) {
  const FLAP = 1.1;

  return (
    <group rotation={[0, -0.12, 0]}>
      <RoundedBox args={[0.52, 0.3, 0.38]} radius={0.012} smoothness={3} position={[0, 0.15, 0]}>
        <ToyMaterial finish={finish} color={color} />
        <Ink />
      </RoundedBox>

      {/* Short flaps, thrown open sideways — where there is room. The long
          pair is tucked down inside, which is where they'd be. */}
      {[-1, 1].map((side) => (
        <RoundedBox
          key={side}
          args={[0.016, 0.17, 0.38]}
          radius={0.006}
          smoothness={2}
          position={[side * (0.26 + 0.085 * Math.sin(FLAP)), 0.3 + 0.085 * Math.cos(FLAP), 0]}
          rotation={[0, 0, -side * FLAP]}
        >
          <ToyMaterial finish={finish} color={color} />
          <Ink weight="thin" />
        </RoundedBox>
      ))}

      {/* Crinkled packing paper, so the box reads as full rather than as a
          lid someone forgot to draw. */}
      {[-0.13, 0.11].map((x, i) => (
        <mesh key={x} position={[x, 0.3, 0.05 - i * 0.12]} rotation={[-1.2 + i * 0.3, 0.4 * i, 0.3]}>
          <planeGeometry args={[0.2, 0.13]} />
          <meshToonMaterial color="#d8cdb8" gradientMap={labelRamp()} side={2} />
        </mesh>
      ))}

      <Headset />

      {label && <PrintedFace label={label} position={[0, 0.165, 0.192]} size={[0.37, 0.21]} />}
      {/* Low and right, clipping the corner of the shipping label rather than
          sitting across its name — a roundel that covers the product it is
          stuck to is a roundel nobody can read. */}
      {sticker && (
        <Sticker sticker={sticker} position={[0.155, 0.093, 0.198]} size={0.19} rotation={[0, 0, 0.3]} />
      )}
    </group>
  );
}

/**
 * The headset in the box: the only literal object in the shop, because "sales
 * call trainer" is not a thing anyone pictures from the words alone. The mic
 * tip is lit — the thing is powered up, it just isn't finished.
 */
function Headset() {
  // Light band, dark cups: the reverse of that on an orange box is a brown
  // smudge, and this is the only thing in the shot saying what's in there.
  const band = '#d8cec0';

  return (
    <group position={[0.02, 0.285, -0.02]} rotation={[0.12, 0.3, -0.08]}>
      {/* Headband, a half ring: the silhouette that says headset. */}
      <mesh>
        <torusGeometry args={[0.085, 0.017, 10, 28, Math.PI]} />
        <meshToonMaterial color={band} gradientMap={setRamp()} />
        <Ink weight="thin" />
      </mesh>

      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.085, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.044, 0.048, 0.05, 20]} />
            <meshToonMaterial color={palette.ink700()} gradientMap={setRamp()} />
            <Ink weight="thin" />
          </mesh>
          <mesh position={[0, 0, 0.026]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.031, 0.031, 0.004, 18]} />
            <meshToonMaterial color={band} gradientMap={setRamp()} />
          </mesh>
        </group>
      ))}

      {/* Mic boom, with the live tip on the end. */}
      <mesh position={[0.11, -0.05, 0.05]} rotation={[0.7, 0, -0.9]}>
        <cylinderGeometry args={[0.006, 0.006, 0.11, 8]} />
        <meshToonMaterial color={palette.ink800()} gradientMap={setRamp()} />
      </mesh>
      <mesh position={[0.145, -0.085, 0.085]}>
        <sphereGeometry args={[0.014, 12, 10]} />
        <meshStandardMaterial
          color={palette.amber300()}
          emissive={palette.amber300()}
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** Spare shapes, for stock that has not arrived yet. */
function Tin({ finish, color, label, sticker }: ShapeProps) {
  return (
    <group>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.5, 32]} />
        <ToyMaterial finish={finish} color={color} />
        <Ink />
      </mesh>
      <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 32]} />
        <ToyMaterial finish={finish} color={color} />
      </mesh>
      {label && <PrintedFace label={label} position={[0, 0.25, 0.201]} size={[0.3, 0.34]} />}
      {sticker && <Sticker sticker={sticker} position={[0.1, 0.41, 0.207]} size={0.2} />}
    </group>
  );
}

function Carton({ finish, color, label, sticker }: ShapeProps) {
  return (
    <group>
      <RoundedBox args={[0.34, 0.5, 0.34]} radius={0.01} smoothness={3} position={[0, 0.25, 0]}>
        <ToyMaterial finish={finish} color={color} />
        <Ink />
      </RoundedBox>
      <mesh position={[0, 0.56, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.26, 0.16, 4]} />
        <ToyMaterial finish={finish} color={color} />
        <Ink weight="thin" />
      </mesh>
      {label && <PrintedFace label={label} position={[0, 0.27, 0.172]} size={[0.28, 0.36]} />}
      {sticker && <Sticker sticker={sticker} position={[0.1, 0.42, 0.178]} size={0.2} />}
    </group>
  );
}

export const shapeMeshes: Record<ProductShape, (props: ShapeProps) => React.JSX.Element> = {
  kiosk: Kiosk,
  'boxed-set': BoxedSet,
  crate: Crate,
  tin: Tin,
  carton: Carton,
};
