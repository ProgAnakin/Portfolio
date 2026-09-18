import type { CSSProperties } from 'react';
import type { ProductTint } from '../data/projects';

/**
 * Products are painted in one muted colour and then *lit*, rather than being
 * coloured in three shades by hand. Each art component reads these four
 * variables, so a new tint is one token in index.css and one name in the type.
 *
 * A lit product picks up the strip above it; an unlit one is pushed back into
 * the shadow of the shelf, which is the whole visual difference between
 * something in stock and something that is not.
 */
export function tintVars(tint: ProductTint, lit: boolean): CSSProperties {
  const base = `var(--prod-${tint})`;

  const vars = lit
    ? {
        '--p-base': `color-mix(in oklab, ${base} 86%, var(--color-amber-300))`,
        '--p-light': `color-mix(in oklab, ${base} 46%, var(--color-amber-200))`,
        '--p-dark': `color-mix(in oklab, ${base} 54%, var(--color-ink-900))`,
        '--p-edge': `color-mix(in oklab, ${base} 32%, var(--color-ink-900))`,
      }
    : {
        '--p-base': `color-mix(in oklab, ${base} 66%, var(--color-ink-900))`,
        '--p-light': `color-mix(in oklab, ${base} 74%, var(--color-paper-500))`,
        '--p-dark': `color-mix(in oklab, ${base} 40%, var(--color-ink-900))`,
        '--p-edge': `color-mix(in oklab, ${base} 24%, var(--color-ink-900))`,
      };

  return vars as CSSProperties;
}
