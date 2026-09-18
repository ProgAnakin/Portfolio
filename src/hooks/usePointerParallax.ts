import { useEffect } from 'react';
import { useMotionValue, useSpring, useReducedMotion, type MotionValue } from 'framer-motion';
import { useHasFinePointer, useIsStage } from './useMediaQuery';

export interface Parallax {
  /** -1 (cursor at the left edge) to 1 (right edge), springed. */
  x: MotionValue<number>;
  y: MotionValue<number>;
  enabled: boolean;
}

const SPRING = { stiffness: 60, damping: 20, mass: 0.6 };

/**
 * Tracks the cursor across the window and hands back two springed values the
 * scene layers lean on. Deliberately slow and shallow: the shelves should
 * breathe as you move, not swim.
 */
export function usePointerParallax(): Parallax {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  const prefersReduced = useReducedMotion();
  const finePointer = useHasFinePointer();
  const isStage = useIsStage();
  const enabled = !prefersReduced && finePointer && isStage;

  useEffect(() => {
    if (!enabled) {
      rawX.set(0);
      rawY.set(0);
      return;
    }
    const onMove = (event: PointerEvent) => {
      rawX.set((event.clientX / window.innerWidth) * 2 - 1);
      rawY.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, rawX, rawY]);

  return { x, y, enabled };
}
