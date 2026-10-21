import { useEffect, useRef, type ComponentPropsWithoutRef } from 'react';
import { useInView, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

import { cn } from '../../lib/cn';

/**
 * Magic UI — NumberTicker. MIT, copyright (c) Magic UI. See ./README.md.
 *
 * CHANGED: honours `prefers-reduced-motion`. Upstream counts regardless, and a
 * number scrambling upwards is exactly the kind of motion somebody turns that
 * setting on to stop. Reduced, it is the final value from the first frame.
 *
 * CHANGED: `aria-hidden`, and the caller renders the real value in an `sr-only`
 * span beside it. The component writes to `textContent` sixty times a second;
 * a screen reader given that live reads a slot machine.
 *
 * CHANGED: dropped `text-black dark:text-white` and `inline-block` from the
 * default classes. This site has one theme, the colour belongs to whatever is
 * using it, and the display mode did too — see `lib/cn` for why a default that
 * a caller has to override is a problem here.
 *
 * CHANGED: the spring and the trigger margin are props. Upstream's damping 60
 * / stiffness 100 takes over three seconds to arrive, and it starts counting
 * only once the number is already on screen — so what a reader scrolling past
 * actually sees is a figure that has not got there yet, which on a page whose
 * numbers are the argument is worse than no animation. Defaults kept; callers
 * can hurry it and start it early.
 */
interface NumberTickerProps extends ComponentPropsWithoutRef<'span'> {
  value: number;
  startValue?: number;
  direction?: 'up' | 'down';
  delay?: number;
  decimalPlaces?: number;
  damping?: number;
  stiffness?: number;
  /** Grows the trigger box, so it starts before the number is on screen. */
  inViewMargin?: string;
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = 'up',
  delay = 0,
  className,
  decimalPlaces = 0,
  damping = 60,
  stiffness = 100,
  inViewMargin = '0px',
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReduced = useReducedMotion();
  const motionValue = useMotionValue(direction === 'down' ? value : startValue);
  const springValue = useSpring(motionValue, { damping, stiffness });
  const isInView = useInView(ref, { once: true, margin: inViewMargin as never });

  const format = (n: number) =>
    Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(Number(n.toFixed(decimalPlaces)));

  useEffect(() => {
    if (prefersReduced) {
      if (ref.current) ref.current.textContent = format(value);
      return;
    }

    let timer: ReturnType<typeof setTimeout> | null = null;
    if (isInView) {
      timer = setTimeout(() => {
        motionValue.set(direction === 'down' ? startValue : value);
      }, delay * 1000);
    }
    return () => {
      if (timer !== null) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motionValue, isInView, delay, value, direction, startValue, prefersReduced, decimalPlaces]);

  useEffect(() => {
    if (prefersReduced) return;
    return springValue.on('change', (latest) => {
      if (ref.current) ref.current.textContent = format(latest);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [springValue, decimalPlaces, prefersReduced]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn('tabular-nums', className)}
      {...props}
    >
      {prefersReduced ? format(value) : format(startValue)}
    </span>
  );
}
