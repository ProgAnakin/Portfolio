import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { ReactNode } from 'react';
import { usePointerParallax } from '../../hooks/usePointerParallax';
import { Chalkboard } from './Chalkboard';
import { Counter } from './Counter';
import { ShelfUnit } from './ShelfUnit';
import { ShopSign } from './ShopSign';

/** One plane of the scene. Deeper things move less as the cursor travels. */
function Layer({
  x,
  y,
  depth,
  className,
  children,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  depth: number;
  className?: string;
  children: ReactNode;
}) {
  const tx = useTransform(x, (value) => value * -depth);
  const ty = useTransform(y, (value) => value * -depth * 0.45);
  return (
    <motion.div style={{ x: tx, y: ty }} className={className}>
      {children}
    </motion.div>
  );
}

export function ShopScene({ onPrintReceipt }: { onPrintReceipt: () => void }) {
  const { x, y } = usePointerParallax();

  return (
    <div className="relative">
      {/* Back wall: a warm bloom where the lamp is, and a skirting line. */}
      <Layer x={x} y={y} depth={4} className="pointer-events-none absolute inset-0 z-0">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(70% 55% at 72% 62%, rgba(232,163,61,0.09), transparent 70%)',
          }}
        />
        <div
          aria-hidden="true"
          className="border-ink-600/70 absolute inset-x-0 bottom-0 h-24 border-t"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(12,10,9,0.55))',
          }}
        />
      </Layer>

      <div className="relative z-10 mx-auto grid max-w-[1400px] items-end gap-y-14 px-4 pt-10 pb-10 sm:px-6 lg:grid-cols-[minmax(0,40rem)_minmax(0,1fr)] lg:gap-x-12 lg:pt-12">
        {/* Shelves */}
        <Layer x={x} y={y} depth={9} className="min-w-0">
          <ShopSign />
          <section
            id="projects"
            aria-labelledby="projects-heading"
            className="scroll-mt-24"
          >
            <h2 id="projects-heading" className="sr-only">
              Projects on the shelves
            </h2>
            <ShelfUnit />
          </section>
        </Layer>

        {/* Counter */}
        <Layer x={x} y={y} depth={15} className="min-w-0 space-y-10 sm:mx-auto sm:w-full sm:max-w-[38rem] lg:mr-0 lg:ml-auto lg:max-w-[34rem] lg:space-y-8">
          <Chalkboard />
          <Counter onPrint={onPrintReceipt} />
        </Layer>
      </div>
    </div>
  );
}
