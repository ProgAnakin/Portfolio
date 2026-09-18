/**
 * The 3D scene reads its colours from the same CSS tokens as the drawing, so
 * there is one palette and not two. Resolved once at scene mount — these are
 * plain hex values in `:root`, not computed colours.
 */
const cache = new Map<string, string>();

export function token(name: string, fallback = '#ffffff'): string {
  const hit = cache.get(name);
  if (hit) return hit;
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const resolved = value || fallback;
  cache.set(name, resolved);
  return resolved;
}

export const palette = {
  ink900: () => token('--color-ink-900', '#0c0a09'),
  ink800: () => token('--color-ink-800', '#14110f'),
  ink700: () => token('--color-ink-700', '#1d1917'),
  ink600: () => token('--color-ink-600', '#2a2422'),
  oak700: () => token('--color-oak-700', '#3b2f27'),
  oak500: () => token('--color-oak-500', '#5a4636'),
  oak300: () => token('--color-oak-300', '#7a6148'),
  amber400: () => token('--color-amber-400', '#e8a33d'),
  amber300: () => token('--color-amber-300', '#f2c078'),
  amber200: () => token('--color-amber-200', '#f8dcae'),
  paper100: () => token('--color-paper-100', '#ede6da'),
  paper500: () => token('--color-paper-500', '#8b8073'),
  accent: () => token('--color-accent', '#e4572e'),
  prod: (tint: string) => token(`--prod-${tint}`, '#6e7a62'),
};
