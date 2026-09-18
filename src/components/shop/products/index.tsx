import type { ProductShape } from '../../../data/projects';
import { BoxedSetProduct } from './BoxedSetProduct';
import { CartonProduct } from './CartonProduct';
import { CrateProduct } from './CrateProduct';
import { KioskProduct } from './KioskProduct';
import { TinProduct } from './TinProduct';
import type { ProductArtProps } from './types';

type ArtComponent = (props: ProductArtProps) => React.JSX.Element;

/**
 * Shape → drawing. A new kind of product is a new file here plus a name in
 * `ProductShape`; nothing else in the scene needs to know about it.
 */
export const productArt: Record<ProductShape, ArtComponent> = {
  kiosk: KioskProduct,
  'boxed-set': BoxedSetProduct,
  crate: CrateProduct,
  tin: TinProduct,
  carton: CartonProduct,
};

/**
 * How tall each shape stands on the shelf, relative to the shelf's own
 * product height. Keeps a tin from looming over a kiosk.
 */
export const productScale: Record<ProductShape, number> = {
  kiosk: 1,
  'boxed-set': 0.84,
  crate: 0.72,
  tin: 0.78,
  carton: 0.95,
};

export type { ProductArtProps };
