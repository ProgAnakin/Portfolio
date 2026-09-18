import type { CSSProperties } from 'react';

/**
 * Products are painted in their own brand colour and then *lit*, rather than
 * being coloured in three shades by hand. Each art component reads these four
 * variables, so a new project's palette is one object in `projects.ts`.
 *
 * A lit product picks up the strip above it; an unlit one is pushed back into
 * the shadow of the shelf, which is the whole visual difference between
 * something in stock and something that is not.
 */
export function tintVars(base: string, lit: boolean): CSSProperties {
  const vars = lit
    ? {
        '--p-base': base,
        '--p-light': `color-mix(in oklab, ${base} 52%, var(--color-amber-200))`,
        '--p-dark': `color-mix(in oklab, ${base} 60%, var(--color-ink-900))`,
        '--p-edge': `color-mix(in oklab, ${base} 36%, var(--color-ink-900))`,
      }
    : {
        '--p-base': `color-mix(in oklab, ${base} 68%, var(--color-ink-900))`,
        '--p-light': `color-mix(in oklab, ${base} 76%, var(--color-paper-500))`,
        '--p-dark': `color-mix(in oklab, ${base} 42%, var(--color-ink-900))`,
        '--p-edge': `color-mix(in oklab, ${base} 26%, var(--color-ink-900))`,
      };

  return vars as CSSProperties;
}
