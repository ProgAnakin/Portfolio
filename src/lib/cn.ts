import { clsx, type ClassValue } from 'clsx';

/**
 * Join class names. Here for the vendored Magic UI components, which are
 * written against it; the site's own components compose classes by hand.
 *
 * Upstream's `cn` wraps this in `tailwind-merge`, which also *resolves*
 * conflicts — `cn('inline-block', 'block')` yields `block` rather than both.
 * That cost 27 KB (8.5 KB compressed) of the entry bundle, measured, which on
 * a page whose first screen is the whole argument is a lot to pay for a class
 * string. So it is `clsx` alone, and the one real conflict it was resolving —
 * `NumberTicker`'s `inline-block` against a caller's `block` — was removed at
 * the source instead.
 *
 * The consequence, if another Magic UI component is ever vendored in: a class
 * passed by a caller no longer beats the component's own, it only joins it,
 * and which one wins is then down to the order Tailwind emitted them in. Check
 * each new one for a default it expects callers to override.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
