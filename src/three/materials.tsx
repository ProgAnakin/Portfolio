import { Outlines } from '@react-three/drei';
import type { ProductFinish } from '../data/projects';
import { finishRampTexture, INK, OUTLINE } from './toon';

interface ToyMaterialProps {
  finish: ProductFinish;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
}

/**
 * The toy material system, cel-shaded.
 *
 * Five finishes, and a product declares which one it is made of. They are
 * deliberately *drawn* materials rather than physical ones: the shop is an
 * illustration of a thing on a shelf, not a photograph of one.
 */
export function ToyMaterial({ finish, color, emissive, emissiveIntensity = 0 }: ToyMaterialProps) {
  return (
    <meshToonMaterial
      color={color}
      gradientMap={finishRampTexture(finish)}
      emissive={emissive ?? '#000000'}
      emissiveIntensity={emissiveIntensity}
    />
  );
}

/**
 * The drawn edge.
 *
 * An inverted hull rather than a post-processing pass: it costs one extra draw
 * per object instead of a full-screen filter, it never touches the DOM layer
 * sitting over the canvas, and it survives on the machines that get the
 * lightweight tier.
 */
export function Ink({ weight = 'medium' }: { weight?: keyof typeof OUTLINE }) {
  return <Outlines thickness={OUTLINE[weight]} color={INK} angle={Math.PI} toneMapped={false} />;
}
