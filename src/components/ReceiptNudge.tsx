import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useExitIntent } from '../hooks/useExitIntent';
import { useShop } from '../state/ShopContext';

const TILL = 'button[aria-label^="Cash register"]';

/**
 * The shopkeeper calling after you on the way out.
 *
 * It appears once, when the pointer heads for the top of the window, and only
 * if the till has not printed yet. The arrow tracks the actual till control —
 * which moves, because in the room it is pinned to a 3D object — so it always
 * points at the thing it is talking about.
 *
 * It is a nudge, not a gate: nothing here blocks navigation, and it can be
 * dismissed with a button or with Escape.
 */
export function ReceiptNudge({ onPrint }: { onPrint: () => void }) {
  const { receiptTaken, basket } = useShop();
  const [dismissed, setDismissed] = useState(false);
  const prefersReduced = useReducedMotion();

  const leaving = useExitIntent({ enabled: !receiptTaken && !dismissed });
  const showing = leaving && !receiptTaken && !dismissed;

  const arrow = useRef<HTMLDivElement>(null);

  // Follow the till. In the room it is tracked to a 3D object, so its position
  // changes every frame; in the drawing it just sits still.
  useEffect(() => {
    if (!showing) return;
    let raf = 0;
    const tick = () => {
      const till = document.querySelector<HTMLElement>(TILL);
      const node = arrow.current;
      if (till && node) {
        const r = till.getBoundingClientRect();
        node.style.transform = `translate3d(${r.left + r.width / 2}px, ${r.top}px, 0) translate(-50%, -100%)`;
        node.style.opacity = r.width > 0 ? '1' : '0';
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [showing]);

  useEffect(() => {
    if (!showing) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDismissed(true);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showing]);

  return (
    <AnimatePresence>
      {showing && (
        <>
          {/* The arrow, over the till. */}
          <motion.div
            key="arrow"
            ref={arrow}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed top-0 left-0 z-[65] flex flex-col items-center"
          >
            <motion.div
              animate={prefersReduced ? undefined : { y: [0, 10, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center"
            >
              <span className="font-till bg-accent text-paper-100 mb-1 px-2 py-1 text-[0.58rem] tracking-[0.16em] whitespace-nowrap uppercase shadow-[0_6px_16px_rgba(12,10,9,0.7)]">
                Click here
              </span>
              <svg width="30" height="34" viewBox="0 0 30 34" className="drop-shadow-[0_4px_8px_rgba(12,10,9,0.8)]">
                <path
                  d="M15 33 3 14h7V2h10v12h7z"
                  fill="var(--color-accent)"
                  stroke="var(--color-ink-900)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.div>

          {/* What the shopkeeper actually says. */}
          <motion.div
            key="card"
            role="status"
            aria-live="polite"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -18, rotate: -1.5 }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0, rotate: -0.8 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -14 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="bg-paper-100 text-ink-900 fixed top-14 left-1/2 z-[66] w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 p-4 shadow-[0_20px_50px_rgba(12,10,9,0.8)]"
          >
            <p className="font-till border-ink-900/25 mb-2 border-b pb-2 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
              Don&rsquo;t forget your receipt
            </p>
            <p className="text-[0.86rem] leading-relaxed">
              {basket.length > 0
                ? `You picked up ${basket.length} thing${basket.length > 1 ? 's' : ''}. The till prints them with my contacts — one click, then you can go.`
                : 'The till prints a short introduction and my contacts. One click, then you can go.'}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={onPrint}
                className="bg-accent text-paper-100 font-till hover:bg-accent-dim cursor-pointer px-3 py-2 text-[0.6rem] tracking-[0.14em] uppercase transition-colors"
              >
                Print the receipt
              </button>
              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="font-till text-ink-900/55 hover:text-ink-900 cursor-pointer px-2 py-2 text-[0.6rem] tracking-[0.14em] uppercase transition-colors"
              >
                No thanks
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
