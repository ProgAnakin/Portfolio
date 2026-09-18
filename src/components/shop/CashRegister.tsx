import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * The till. Hit it and it prints a receipt for the visit.
 *
 * The drawer kicks open on press — a small, physical acknowledgement before
 * the paper starts moving.
 */
export function CashRegister({ onPrint }: { onPrint: () => void }) {
  const prefersReduced = useReducedMotion();
  const [ringing, setRinging] = useState(false);

  return (
    <div className="relative flex h-full items-end">
      <motion.button
        type="button"
        aria-label="Cash register — print a receipt for this visit"
        onClick={() => {
          setRinging(true);
          window.setTimeout(() => setRinging(false), 420);
          onPrint();
        }}
        animate={ringing && !prefersReduced ? 'open' : 'closed'}
        initial="closed"
        whileHover="nudge"
        className="relative cursor-pointer bg-transparent p-0"
      >
        <svg
          viewBox="0 0 164 152"
          className="block h-[calc(var(--counter-item-h)*1.24)] w-auto drop-shadow-[0_6px_10px_rgba(12,10,9,0.6)]"
          aria-hidden="true"
          focusable="false"
        >
          <g filter="url(#rough)">
            {/* Display head */}
            <path d="M44 6h76a8 8 0 0 1 8 8v34H36V14a8 8 0 0 1 8-8z" fill="url(#metal)" />
            <rect x="48" y="16" width="68" height="24" rx="3" fill="var(--color-ink-900)" />
            {/* Body */}
            <path d="M16 48h132a10 10 0 0 1 10 10v74a10 10 0 0 1-10 10H16A10 10 0 0 1 6 132V58a10 10 0 0 1 10-10z" fill="url(#metal)" />
            <path d="M148 48a10 10 0 0 1 10 10v74a10 10 0 0 1-10 10h-14V48z" fill="var(--color-ink-700)" opacity="0.7" />
          </g>

          {/* Amber digits in the window */}
          <g fill="var(--color-amber-300)" opacity="0.9">
            <rect x="94" y="24" width="4" height="9" rx="1" />
            <rect x="101" y="24" width="4" height="9" rx="1" />
            <rect x="108" y="24" width="4" height="9" rx="1" />
          </g>

          {/* The paper slot, with a tab of receipt showing */}
          <rect x="52" y="52" width="60" height="4" rx="2" fill="var(--color-ink-900)" />
          <motion.rect
            variants={{
              closed: { y: 47, opacity: 0.85 },
              nudge: { y: 43, opacity: 1 },
              open: { y: 38, opacity: 1 },
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            x="60"
            width="44"
            height="10"
            rx="1"
            fill="var(--color-paper-100)"
          />

          {/* Keypad */}
          <g fill="var(--color-ink-900)" opacity="0.7">
            {[0, 1, 2].map((row) =>
              [0, 1, 2].map((col) => (
                <circle key={`${row}-${col}`} cx={38 + col * 20} cy={76 + row * 17} r={5.4} />
              )),
            )}
          </g>
          <rect x="104" y="70" width="26" height="40" rx="4" fill="var(--color-accent)" opacity="0.62" />

          {/* Drawer */}
          <motion.g
            variants={{
              closed: { x: 0 },
              nudge: { x: -3 },
              open: { x: -22 },
            }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
          >
            <rect x="14" y="120" width="136" height="24" rx="4" fill="var(--color-ink-600)" />
            <rect x="14" y="120" width="136" height="3" fill="var(--color-ink-900)" opacity="0.7" />
            <rect x="68" y="129" width="28" height="5" rx="2.5" fill="var(--color-oak-300)" opacity="0.75" />
          </motion.g>
        </svg>
      </motion.button>
    </div>
  );
}
