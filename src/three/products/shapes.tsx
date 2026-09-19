import { RoundedBox } from '@react-three/drei';
import type { Texture } from 'three';
import type { ProductFinish, ProductShape } from '../../data/projects';
import { Ink, ToyMaterial } from '../materials';
import { labelRamp } from '../toon';
import { palette } from '../tokens';

export interface ShapeProps {
  finish: ProductFinish;
  color: string;
  label: Texture | null;
  /** The status roundel, when the thing is not finished. */
  sticker: Texture | null;
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
function Kiosk({ finish, color, label, sticker, lit }: ShapeProps) {
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
            <meshToonMaterial
              color={palette.amber400()}
              emissive={palette.amber400()}
              emissiveIntensity={lit ? 0.22 : 0}
              gradientMap={labelRamp()}
            />
            <Ink weight="thin" />
          </RoundedBox>
        </group>
      </group>
    </group>
  );
}

/**
 * Kouci: a deep boxed set leaning back on the shelf so its top face shows,
 * with the ball out of the box in front of it — a display, not a stack.
 */
function BoxedSet({ finish, color, label, sticker }: ShapeProps) {
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

      {/* The ball, out of the box. */}
      <mesh position={[0.28, 0.1, 0.16]}>
        <sphereGeometry args={[0.1, 24, 20]} />
        <meshToonMaterial color={palette.amber400()} gradientMap={labelRamp()} />
        <Ink weight="thin" />
      </mesh>
      {/* Two drawn seams, so it is a ball and not a dot. */}
      <mesh position={[0.28, 0.1, 0.16]} rotation={[0, 0, 0.4]}>
        <torusGeometry args={[0.1, 0.007, 8, 28]} />
        <meshBasicMaterial color={palette.ink900()} />
      </mesh>
    </group>
  );
}

/**
 * Sales Call Trainer: a shipping box that was never opened. Flaps still up,
 * tape across the seam — the status is the object, not a badge on it.
 */
function Crate({ finish, color, label, sticker }: ShapeProps) {
  return (
    <group>
      <RoundedBox args={[0.48, 0.4, 0.44]} radius={0.014} smoothness={3} position={[0, 0.2, 0]}>
        <ToyMaterial finish={finish} color={color} />
        <Ink />
      </RoundedBox>

      {/* Flaps, still standing up. */}
      {[-1, 1].map((side) => (
        <RoundedBox
          key={side}
          args={[0.48, 0.2, 0.02]}
          radius={0.008}
          smoothness={2}
          position={[0, 0.47, side * 0.19]}
          rotation={[side * 0.42, 0, 0]}
        >
          <ToyMaterial finish={finish} color={color} />
          <Ink weight="thin" />
        </RoundedBox>
      ))}

      {/* Tape across the seam. */}
      <mesh position={[0, 0.401, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.12, 0.45]} />
        <meshBasicMaterial color="#cabfae" transparent opacity={0.42} />
      </mesh>

      {label && <PrintedFace label={label} position={[0, 0.22, 0.222]} size={[0.36, 0.28]} />}
      {sticker && (
        <Sticker sticker={sticker} position={[0.16, 0.37, 0.228]} size={0.26} rotation={[0, 0, 0.26]} />
      )}
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
