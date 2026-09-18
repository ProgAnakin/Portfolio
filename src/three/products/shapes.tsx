import { RoundedBox } from '@react-three/drei';
import type { Texture } from 'three';
import type { ProductFinish, ProductShape } from '../../data/projects';
import { Ink, ToyMaterial } from '../materials';
import { labelRamp } from '../toon';

export interface ShapeProps {
  finish: ProductFinish;
  color: string;
  label: Texture | null;
  lit: boolean;
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

/** The kiosk: a tablet on a weighted stand, screen awake. */
function Kiosk({ finish, color, label, lit }: ShapeProps) {
  return (
    <group>
      <RoundedBox args={[0.38, 0.05, 0.26]} radius={0.018} smoothness={3} position={[0, 0.025, 0]}>
        <ToyMaterial finish={finish} color={color} />
        <Ink weight="thin" />
      </RoundedBox>
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 0.24, 20]} />
        <ToyMaterial finish={finish} color={color} />
        <Ink weight="thin" />
      </mesh>
      <RoundedBox args={[0.46, 0.58, 0.05]} radius={0.022} smoothness={3} position={[0, 0.57, 0]}>
        <ToyMaterial finish={finish} color={color} />
        <Ink />
      </RoundedBox>
      {/* The screen is the light source on this shelf. */}
      {label && (
        <mesh key={label.uuid} position={[0, 0.57, 0.027]}>
          <planeGeometry args={[0.37, 0.48]} />
          <meshBasicMaterial map={label} toneMapped={false} color={lit ? '#ffffff' : '#8c8378'} />
        </mesh>
      )}
    </group>
  );
}

/** A boxed set, standing on the shelf with its front showing. */
function BoxedSet({ finish, color, label }: ShapeProps) {
  return (
    <group>
      <RoundedBox args={[0.52, 0.62, 0.2]} radius={0.014} smoothness={3} position={[0, 0.31, 0]}>
        <ToyMaterial finish={finish} color={color} />
        <Ink />
      </RoundedBox>
      {label && <PrintedFace label={label} position={[0, 0.31, 0.101]} size={[0.5, 0.6]} />}
    </group>
  );
}

/** A plain taped carton. The unfinished project ships in unbranded board. */
function Crate({ finish, color, label }: ShapeProps) {
  return (
    <group>
      <RoundedBox args={[0.46, 0.42, 0.42]} radius={0.012} smoothness={3} position={[0, 0.21, 0]}>
        <ToyMaterial finish={finish} color={color} />
        <Ink />
      </RoundedBox>
      {/* Packing tape down the seam. */}
      <mesh position={[0, 0.421, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 0.43]} />
        <meshBasicMaterial color="#c9bfb0" transparent opacity={0.3} />
      </mesh>
      {label && <PrintedFace label={label} position={[0, 0.24, 0.212]} size={[0.38, 0.3]} />}
    </group>
  );
}

/** Spare shapes, for stock that has not arrived yet. */
function Tin({ finish, color, label }: ShapeProps) {
  return (
    <group>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.5, 32]} />
        <ToyMaterial finish={finish} color={color} />
        <Ink />
      </mesh>
      {label && <PrintedFace label={label} position={[0, 0.25, 0.201]} size={[0.3, 0.34]} />}
    </group>
  );
}

function Carton({ finish, color, label }: ShapeProps) {
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
