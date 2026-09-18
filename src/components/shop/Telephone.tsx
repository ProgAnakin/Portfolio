import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { contacts } from '../../data/profile';

/**
 * The phone on the counter. Pick it up and it tells you how to reach me.
 *
 * It opens on hover for people using a mouse, on focus for people using a
 * keyboard, and on tap for everyone else — and the card only mounts while it
 * is open, so the links inside are never a tab stop on a closed phone.
 */
export function Telephone() {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const cardId = useId();
  const prefersReduced = useReducedMotion();

  const show = () => setOpen(true);
  const hide = () => {
    if (!pinned) setOpen(false);
  };

  return (
    <div
      ref={wrapper}
      className="relative flex h-full items-end"
      onPointerEnter={show}
      onPointerLeave={hide}
      onFocus={show}
      onBlur={(event) => {
        if (!wrapper.current?.contains(event.relatedTarget as Node | null)) {
          setPinned(false);
          setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.stopPropagation();
          setPinned(false);
          setOpen(false);
          wrapper.current?.querySelector('button')?.focus();
        }
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            id={cardId}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 8, rotate: -4 }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0, rotate: -1.6 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 6, rotate: -4 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="bg-paper-100 text-ink-900 absolute bottom-full left-0 z-40 mb-3 w-[min(15rem,calc(100vw-3rem))] p-3 shadow-[0_10px_24px_rgba(12,10,9,0.6)]"
          >
            <p className="font-till border-ink-900/25 mb-2 border-b pb-1.5 text-[0.6rem] tracking-[0.16em] uppercase">
              Ask for Costanzo
            </p>
            <ul className="space-y-1.5">
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <a
                    href={contact.href}
                    target={contact.href.startsWith('http') ? '_blank' : undefined}
                    rel={contact.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="decoration-accent hover:text-accent focus-visible:text-accent block text-sm underline decoration-2 underline-offset-2"
                  >
                    <span className="font-till mr-1.5 text-[0.6rem] tracking-[0.12em] uppercase opacity-60">
                      {contact.label}
                    </span>
                    <span className="break-all">{contact.value}</span>
                  </a>
                </li>
              ))}
            </ul>
            {/* The pin holding the card to the counter. */}
            <span
              aria-hidden="true"
              className="bg-accent absolute -top-1.5 left-8 size-3 rounded-full shadow"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-expanded={open}
        aria-controls={open ? cardId : undefined}
        aria-label="Telephone — show contact details"
        onClick={() => {
          setPinned((was) => !was);
          setOpen(true);
        }}
        animate={open ? 'ringing' : 'rest'}
        initial="rest"
        className="relative cursor-pointer bg-transparent p-0"
        style={{ ['--p-base' as string]: 'var(--prod-clay)' }}
      >
        <svg
          viewBox="0 0 140 112"
          className="block h-[var(--counter-item-h)] w-auto drop-shadow-[0_5px_8px_rgba(12,10,9,0.6)]"
          aria-hidden="true"
          focusable="false"
        >
          <g filter="url(#rough)">
            {/* Base */}
            <path
              d="M16 100h108q10 0 8-10l-8-38q-2-10-12-10H28q-10 0-12 10L8 90q-2 10 8 10z"
              fill="var(--prod-clay)"
            />
            <path
              d="M124 100q10 0 8-10l-8-38q-2-10-12-10h-12q10 0 12 10l8 38q2 10-8 10z"
              fill="color-mix(in oklab, var(--prod-clay) 55%, var(--color-ink-900))"
            />
            {/* Dial face */}
            <circle cx="70" cy="76" r="17" fill="var(--color-ink-900)" opacity="0.55" />
            <circle cx="70" cy="76" r="6" fill="var(--color-paper-100)" opacity="0.35" />
            {/* Cradle prongs */}
            <rect x="34" y="36" width="10" height="10" rx="3" fill="var(--color-ink-900)" opacity="0.6" />
            <rect x="96" y="36" width="10" height="10" rx="3" fill="var(--color-ink-900)" opacity="0.6" />
          </g>

          {/* Coiled cord — stretches as the handset comes up. */}
          <motion.path
            variants={{
              rest: { d: 'M20 62q-9 5 0 10q9 5 0 10q-9 5 0 10' },
              ringing: { d: 'M20 44q-11 7 0 14q11 7 0 14q-11 7 0 14' },
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            stroke="color-mix(in oklab, var(--prod-clay) 60%, var(--color-ink-900))"
            strokeWidth="3.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Handset */}
          <motion.g
            variants={{
              rest: { y: 0, rotate: 0 },
              ringing: prefersReduced ? { y: 0, rotate: 0 } : { y: -14, rotate: -7 },
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ originX: '20px', originY: '30px' }}
            filter="url(#rough)"
          >
            <rect x="26" y="20" width="88" height="12" rx="6" fill="var(--prod-clay)" />
            <rect x="14" y="12" width="28" height="26" rx="9" fill="var(--prod-clay)" />
            <rect x="98" y="12" width="28" height="26" rx="9" fill="var(--prod-clay)" />
            <rect
              x="26"
              y="20"
              width="88"
              height="4"
              rx="2"
              fill="var(--color-amber-200)"
              opacity="0.35"
            />
          </motion.g>
        </svg>
      </motion.button>
    </div>
  );
}
