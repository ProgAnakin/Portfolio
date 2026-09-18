import type { CSSProperties } from 'react';

export interface ProductArtProps {
  /** Lit products sit under the strip; unlit ones are pushed to the back. */
  lit: boolean;
  className?: string;
  style?: CSSProperties;
}
