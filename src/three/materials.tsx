import type { ProductFinish } from '../data/projects';

/**
 * The toy material system.
 *
 * Five finishes, and a product declares which one it is made of. They are
 * deliberately *toy* materials rather than realistic ones: the shop is a
 * thing on a shelf, not a photograph of a thing on a shelf.
 */
export interface FinishSpec {
  roughness: number;
  metalness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  /** Pulls the base colour toward white so glossy things read as glossy. */
  sheen: number;
}

export const finishes: Record<ProductFinish, FinishSpec> = {
  // Injection-moulded toy: hard highlight, wet-looking top coat.
  plastic: { roughness: 0.28, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08, sheen: 0 },
  // Unfired clay: no highlight at all, light sinks in.
  clay: { roughness: 0.96, metalness: 0, clearcoat: 0, clearcoatRoughness: 1, sheen: 0 },
  // Matte rubber: soft wide highlight, slightly velvety edge.
  rubber: { roughness: 0.78, metalness: 0, clearcoat: 0.18, clearcoatRoughness: 0.7, sheen: 0.6 },
  // Chrome: reflects the shop's own strip lights and nothing else.
  chrome: { roughness: 0.08, metalness: 1, clearcoat: 0.4, clearcoatRoughness: 0.05, sheen: 0 },
  // Printed board: the only material allowed to look cheap.
  card: { roughness: 0.92, metalness: 0, clearcoat: 0.05, clearcoatRoughness: 0.9, sheen: 0.25 },
};

interface ToyMaterialProps {
  finish: ProductFinish;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
}

export function ToyMaterial({ finish, color, emissive, emissiveIntensity = 0 }: ToyMaterialProps) {
  const spec = finishes[finish];
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={spec.roughness}
      metalness={spec.metalness}
      clearcoat={spec.clearcoat}
      clearcoatRoughness={spec.clearcoatRoughness}
      sheen={spec.sheen}
      sheenColor="#ffffff"
      emissive={emissive ?? '#000000'}
      emissiveIntensity={emissiveIntensity}
      envMapIntensity={finish === 'chrome' ? 1.6 : 0.65}
    />
  );
}
