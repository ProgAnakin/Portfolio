import { useEffect, useState } from 'react';

/**
 * Subscribes to a media query. Used to decide *behaviour* — whether to run
 * parallax, whether the counter is a sidebar or the last section — while
 * plain CSS still does all the layout work.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/**
 * Tailwind's `sm` breakpoint — from here up a shelf is a shelf, holding
 * several products side by side. Below it the scene unrolls instead, one
 * product per shelf section. (Where the *counter* sits is a separate
 * question, and pure CSS: beside the shelves at `lg`, under them below it.)
 */
export const useShelvedLayout = () => useMediaQuery('(min-width: 40rem)');

/** Tailwind's `lg` breakpoint — the whole shop on one stage. */
export const useIsStage = () => useMediaQuery('(min-width: 64rem)');

/** A pointer that can actually hover. Touch screens get no parallax. */
export const useHasFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');
