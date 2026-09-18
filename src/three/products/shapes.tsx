import { RoundedBox } from '@react-three/drei';
import type { Texture } from 'three';
import type { ProductShape } from '../../data/projects';
import { ToyMaterial } from '../materials';
import type { ProductFinish } from '../../data/projects';

export interface ShapeProps {
  finish: ProductFinish;
  color: string;
  label: Texture | null;
  lit: boolean;
}

/** The kiosk: a tablet on a weighted stand, screen awake. */
function Kiosk({ finish, color, label, lit }: ShapeProps) {
  return (
    <group>
      <RoundedBox args={[0.38, 0.05, 0.26]} radius={0.018} smoothness={3} position={[0, 0.025, 0]}>
        <ToyMaterial finish={finish} color={color} />
      </RoundedBox>
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 0.24, 20]} />
        <ToyMaterial finish={finish} color={color} />
      </mesh>
      <RoundedBox args={[0.46, 0.58, 0.05]} radius={0.022} smoothness={3} position={[0, 0.57, 0]}>
        <ToyMaterial finish={finish} color={color} />
      </RoundedBox>
      {/* The screen is the light source on this shelf. */}
      {label && (
        <mesh key={label.uuid} position={[0, 0.57, 0.027]}>
          <planeGeometry args={[0.37, 0.48]} />
          <meshStandardMaterial
            map={label}
            emissiveMap={label}
            emissive="#ffffff"
            emissiveIntensity={lit ? 0.42 : 0.06}
          />
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
      </RoundedBox>
      {label && (
        <mesh key={label.uuid} position={[0, 0.31, 0.101]}>
          <planeGeometry args={[0.5, 0.6]} />
          <meshPhysicalMaterial map={label} roughness={0.42} clearcoat={0.85} clearcoatRoughness={0.14} />
        </mesh>
      )}
    </group>
  );
}

/** A plain taped carton. The unfinished project ships in unbranded board. */
function Crate({ finish, color, label }: ShapeProps) {
  return (
    <group>
      <RoundedBox args={[0.46, 0.42, 0.42]} radius={0.012} smoothness={3} position={[0, 0.21, 0]}>
        <ToyMaterial finish={finish} color={color} />
      </RoundedBox>
      {/* Packing tape down the seam. */}
      <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 0.43]} />
        <meshStandardMaterial color="#c9bfb0" transparent opacity={0.34} roughness={0.5} />
      </mesh>
      {label && (
        <mesh key={label.uuid} position={[0, 0.24, 0.212]}>
          <planeGeometry args={[0.38, 0.3]} />
          <meshStandardMaterial map={label} roughness={0.95} />
        </mesh>
      )}
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
      </mesh>
      {label && (
        <mesh key={label.uuid} position={[0, 0.25, 0.201]}>
          <planeGeometry args={[0.3, 0.34]} />
          <meshStandardMaterial map={label} roughness={0.7} />
        </mesh>
      )}
    </group>
  );
}

function Carton({ finish, color, label }: ShapeProps) {
  return (
    <group>
      <RoundedBox args={[0.34, 0.5, 0.34]} radius={0.01} smoothness={3} position={[0, 0.25, 0]}>
        <ToyMaterial finish={finish} color={color} />
      </RoundedBox>
      <mesh position={[0, 0.56, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.26, 0.16, 4]} />
        <ToyMaterial finish={finish} color={color} />
      </mesh>
      {label && (
        <mesh key={label.uuid} position={[0, 0.27, 0.172]}>
          <planeGeometry args={[0.28, 0.36]} />
          <meshStandardMaterial map={label} roughness={0.85} />
        </mesh>
      )}
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
