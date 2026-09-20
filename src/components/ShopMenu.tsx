import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { projects, statusLabel } from '../data/projects';
import { useShop } from '../state/ShopContext';
import { slotFor } from '../data/shelving';

/** A ragged tear across the bottom of the strip. */
function tornEdge(width = 200, tooth = 5): string {
  let d = `M0 0 H${width} V2.5 `;
  for (let x = width; x > 0; x -= tooth) {
    d += `L${(x - tooth / 2).toFixed(2)} 7 L${Math.max(x - tooth, 0).toFixed(2)} 2.5 `;
  }
  return `${d}Z`;
}

/** Sends focus somewhere in the page, scrolling to it if it is off screen. */
function goTo(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  if (target instanceof HTMLElement) target.focus({ preventScroll: true });
}

interface Row {
  key: string;
  aisle: string;
  label: string;
  note: string;
  onPick: () => void;
}

/**
 * The store directory, on a tag by the door.
 *
 * A shop this size does not have a navigation bar; it has a card telling you
 * which aisle things are in. Pull the tag and the card unrolls, printed on the
 * same paper as the receipt — the aisle numbers are the real shelf numbers, so
 * it is a map as well as a menu, and every product can be opened from it
 * without finding it on the shelf first.
 *
 * It is a second route, not the only one: the skip link still jumps straight
 * to the shelves, and everything listed here is also a control in the room.
 */
export function ShopMenu({ onPrintReceipt }: { onPrintReceipt: () => void }) {
  const { open: openProject } = useShop();
  const [open, setOpen] = useState(false);
  const prefersReduced = useReducedMotion();
  const wrapper = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  const pick = (run: () => void) => () => {
    setOpen(false);
    run();
  };

  const rows: Row[] = [
    ...projects.map((project) => ({
      key: project.id,
      aisle: `A${slotFor(project.id).shelf + 1}`,
      label: project.name,
      note: statusLabel[project.status],
      onPick: pick(() => openProject(project.id)),
    })),
    {
      key: 'about',
      aisle: '—',
      label: 'About',
      note: "TODAY'S MENU",
      onPick: pick(() => goTo('about')),
    },
    {
      key: 'contact',
      aisle: '—',
      label: 'Contact',
      note: 'THE TELEPHONE',
      onPick: pick(() => goTo('contact')),
    },
    {
      key: 'receipt',
      aisle: '—',
      label: 'Receipt',
      note: 'PRINT & GO',
      onPick: pick(onPrintReceipt),
    },
  ];

  return (
    <div ref={wrapper} className="fixed top-4 right-4 z-[55] print:hidden">
      {/* The string the tag hangs from. */}
      <span aria-hidden="true" className="bg-ink-500 absolute top-0 left-1/2 h-4 w-px -translate-y-full" />

      <motion.button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls="shop-directory"
        aria-label={open ? 'Close the store directory' : 'Open the store directory'}
        onClick={() => setOpen((was) => !was)}
        animate={open ? { rotate: 0 } : { rotate: -3 }}
        whileHover={prefersReduced ? undefined : { rotate: 3, y: 2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 12 }}
        className="border-oak-500 bg-ink-700 relative flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-full border-2 shadow-[0_8px_20px_rgba(12,10,9,0.6)]"
      >
        {/* The eyelet. */}
        <span aria-hidden="true" className="border-oak-300/70 absolute top-1 size-2 rounded-full border" />
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          className="mt-2 flex flex-col items-center gap-[3px]"
        >
          <span className="bg-paper-100 block h-[2px] w-4 rounded-full" />
          <span className="bg-paper-100 block h-[2px] w-4 rounded-full" />
          <span className="bg-accent block h-[2px] w-4 rounded-full" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="shop-directory"
            initial={{ height: prefersReduced ? 'auto' : 0, opacity: prefersReduced ? 0 : 1 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: prefersReduced ? 'auto' : 0, opacity: prefersReduced ? 0 : 1 }}
            transition={{ duration: prefersReduced ? 0.15 : 0.5, ease: [0.16, 0.9, 0.3, 1] }}
            className="absolute top-14 right-0 w-[17rem] origin-top overflow-hidden"
          >
            <motion.div
              initial={prefersReduced ? undefined : { x: 0 }}
              animate={prefersReduced ? undefined : { x: [0, -1.4, 1.4, -0.8, 0] }}
              transition={{ duration: 0.16, repeat: 3 }}
              className="bg-paper-100 text-ink-900 font-till px-4 pt-4 pb-3 shadow-[0_18px_44px_rgba(12,10,9,0.75)]"
            >
              <p className="text-[0.62rem] font-bold tracking-[0.18em] uppercase">Store directory</p>
              <div aria-hidden="true" className="border-ink-900/35 my-2 border-t border-dashed" />

              <ul>
                {rows.map((row, index) => (
                  <motion.li
                    key={row.key}
                    initial={prefersReduced ? undefined : { opacity: 0, y: -6 }}
                    animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
                    transition={{ delay: prefersReduced ? 0 : 0.14 + index * 0.055 }}
                  >
                    {index === projects.length && (
                      <div aria-hidden="true" className="border-ink-900/35 my-2 border-t border-dashed" />
                    )}
                    <button
                      type="button"
                      onClick={row.onPick}
                      className="hover:bg-ink-900 hover:text-paper-100 focus-visible:bg-ink-900 focus-visible:text-paper-100 group flex w-full cursor-pointer items-baseline gap-2 px-1 py-1.5 text-left transition-colors"
                    >
                      <span className="w-6 shrink-0 text-[0.58rem] tracking-[0.1em] opacity-55">
                        {row.aisle}
                      </span>
                      <span className="truncate text-[0.78rem] font-bold tracking-[0.04em] uppercase">
                        {row.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="border-ink-900/25 group-hover:border-paper-100/30 group-focus-visible:border-paper-100/30 mb-1 grow border-b border-dotted"
                      />
                      <span className="shrink-0 text-[0.52rem] tracking-[0.1em] opacity-55">
                        {row.note}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>

              <p className="mt-2 text-center text-[0.5rem] tracking-[0.16em] opacity-45 uppercase">
                Annichini &amp; Co. · open late
              </p>
            </motion.div>

            {/* Torn edge, so the card reads as paper rather than as a panel. */}
            <svg
              viewBox="0 0 200 7"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="-mt-px block h-2 w-full drop-shadow-[0_10px_18px_rgba(12,10,9,0.6)]"
            >
              <path d={tornEdge()} fill="var(--color-paper-100)" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
