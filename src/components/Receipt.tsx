import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Modal } from './Modal';
import { contacts, profile, receipt as till } from '../data/profile';
import type { Project } from '../data/projects';

/** A ragged tear across the bottom of the paper. */
function tornEdge(width = 200, tooth = 5): string {
  let d = `M0 0 H${width} V2.5 `;
  for (let x = width; x > 0; x -= tooth) {
    d += `L${(x - tooth / 2).toFixed(2)} 7 L${Math.max(x - tooth, 0).toFixed(2)} 2.5 `;
  }
  return `${d}Z`;
}

/** Bars derived from what was picked up, so every visit prints its own code. */
function barcode(seed: string): number[] {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Array.from({ length: 44 }, (_, i) => {
    hash = Math.imul(hash ^ (i + 1), 16777619);
    return ((hash >>> 8) % 3) + 1;
  });
}

function clock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const Rule = ({ double = false }: { double?: boolean }) => (
  <div
    aria-hidden="true"
    className={`border-ink-900/35 my-2 ${double ? 'border-t-[3px] border-double' : 'border-t border-dashed'}`}
  />
);

interface ReceiptProps {
  basket: Project[];
  seconds: number;
  onClose: () => void;
}

export function Receipt({ basket, seconds, onClose }: ReceiptProps) {
  const prefersReduced = useReducedMotion();
  const [printed, setPrinted] = useState(prefersReduced ?? false);

  const stamped = useMemo(() => new Date(), []);
  const bars = useMemo(
    () => barcode(basket.map((p) => p.id).join('-') || 'browsing'),
    [basket],
  );

  // A receipt that never finished printing would trap the buttons, so make
  // sure the paper always lands even if the animation is interrupted.
  useEffect(() => {
    if (printed) return;
    const settled = window.setTimeout(() => setPrinted(true), 2600);
    return () => window.clearTimeout(settled);
  }, [printed]);

  return (
    <Modal
      onClose={onClose}
      labelledBy="receipt-heading"
      className="relative z-10 w-full max-w-[26rem] px-4 pt-6 pb-16 sm:pt-10"
    >
      {/* The printer slot the paper comes out of. */}
      <div aria-hidden="true" className="receipt-no-print relative mx-auto w-full max-w-[22rem]">
        <div className="bg-ink-600 border-ink-500 h-4 rounded-t-md border border-b-0 shadow-[inset_0_-3px_6px_rgba(0,0,0,0.6)]" />
        <div className="bg-ink-900 mx-3 h-1.5 rounded-b-sm" />
      </div>

      <motion.div
        initial={{ height: prefersReduced ? 'auto' : 0 }}
        animate={{ height: 'auto' }}
        transition={{ duration: prefersReduced ? 0 : 1.7, ease: [0.16, 0.9, 0.3, 1] }}
        onAnimationComplete={() => setPrinted(true)}
        className="mx-auto w-full max-w-[22rem] overflow-hidden"
      >
        <motion.div
          animate={printed || prefersReduced ? { x: 0 } : { x: [0, -1.1, 1.1, -0.7, 0.7, 0] }}
          transition={
            printed || prefersReduced
              ? { duration: 0.2 }
              : { duration: 0.14, repeat: Infinity, ease: 'linear' }
          }
          className="receipt-printable bg-paper-100 text-ink-900 font-till px-5 pt-6 pb-3 text-[0.72rem] leading-[1.6] shadow-[0_18px_40px_rgba(12,10,9,0.7)]"
        >
          <h2 id="receipt-heading" className="text-center text-base font-bold tracking-[0.18em]">
            {profile.shopName}
          </h2>
          <p className="text-center text-[0.6rem] tracking-[0.22em] opacity-70">
            SALES · PRODUCT · RETAIL
          </p>

          <Rule double />

          <div className="flex justify-between text-[0.62rem] tracking-[0.1em] opacity-80">
            <span>{till.till}</span>
            <span>OP: {till.operator}</span>
          </div>
          <div className="flex justify-between text-[0.62rem] tracking-[0.1em] opacity-80">
            <time dateTime={stamped.toISOString()}>{stamped.toISOString().slice(0, 10)}</time>
            <span>{stamped.toTimeString().slice(0, 5)}</span>
          </div>

          <Rule />

          <p className="flex justify-between text-[0.6rem] tracking-[0.16em] opacity-60">
            <span>QTY ITEM</span>
            <span>YEAR</span>
          </p>

          {basket.length === 0 ? (
            <div className="py-3 text-center">
              <p className="tracking-[0.12em]">{till.emptyBasket}</p>
              <p className="mt-1 text-[0.62rem] opacity-60">{till.emptyHint}</p>
            </div>
          ) : (
            <ul className="mt-1 space-y-2">
              {basket.map((project) => (
                <li key={project.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-bold tracking-[0.08em] uppercase">
                      1 &nbsp;{project.name}
                    </span>
                    <span className="shrink-0 opacity-70">{project.tag.year}</span>
                  </div>
                  <p className="pl-5 text-[0.62rem] opacity-65">{project.tagline}</p>
                </li>
              ))}
            </ul>
          )}

          <Rule />

          <div className="flex justify-between tracking-[0.08em]">
            <span>ITEMS PICKED UP</span>
            <span className="font-bold">{basket.length}</span>
          </div>
          <div className="flex justify-between tracking-[0.08em] opacity-80">
            <span>TIME IN SHOP</span>
            <span>{clock(seconds)}</span>
          </div>

          <Rule double />

          <p className="text-[0.6rem] tracking-[0.18em] opacity-60">ABOUT THE SHOPKEEPER</p>
          <p className="mt-1 text-[0.68rem] leading-[1.7]">{till.pitch}</p>

          <Rule />

          <p className="text-[0.6rem] tracking-[0.18em] opacity-60">CONTACT</p>
          <ul className="mt-1 space-y-0.5">
            {contacts.map((contact) => (
              <li key={contact.id} className="flex items-baseline gap-2">
                <span className="w-14 shrink-0 text-[0.6rem] tracking-[0.1em] opacity-55 uppercase">
                  {contact.label}
                </span>
                <a
                  href={contact.href}
                  target={contact.href.startsWith('http') ? '_blank' : undefined}
                  rel={contact.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="decoration-accent hover:text-accent break-all underline decoration-2 underline-offset-2"
                >
                  {contact.value}
                </a>
              </li>
            ))}
          </ul>

          <Rule double />

          <p className="text-center text-[0.62rem] tracking-[0.2em]">{till.footer}</p>
          <p className="mt-0.5 text-center text-[0.58rem] tracking-[0.14em] opacity-60">
            {till.thanks}
          </p>

          {/* Barcode */}
          <div aria-hidden="true" className="mt-3 flex h-9 items-end justify-center gap-[2px]">
            {bars.map((weight, index) => (
              <span
                key={index}
                className="bg-ink-900 h-full"
                style={{ width: `${weight}px`, opacity: weight === 1 ? 0.75 : 1 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Torn edge — appears once the paper is off the roll. */}
        <motion.svg
          viewBox="0 0 200 7"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="receipt-printable -mt-px block h-2 w-full drop-shadow-[0_10px_18px_rgba(12,10,9,0.6)]"
          initial={{ opacity: prefersReduced ? 1 : 0 }}
          animate={{ opacity: printed ? 1 : 0 }}
        >
          <path d={tornEdge()} fill="var(--color-paper-100)" />
        </motion.svg>
      </motion.div>

      {/* Actions live outside the paper so they never end up on a printout. */}
      <motion.div
        initial={{ opacity: prefersReduced ? 1 : 0 }}
        animate={{ opacity: printed ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="receipt-no-print mx-auto mt-6 flex max-w-[22rem] items-center justify-center gap-3"
      >
        <button
          type="button"
          onClick={() => window.print()}
          className="border-paper-500/40 text-paper-100 font-till hover:border-accent hover:text-accent cursor-pointer border px-4 py-2 text-[0.62rem] tracking-[0.16em] uppercase transition-colors"
        >
          Print / save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-paper-500 font-till hover:text-paper-100 cursor-pointer px-4 py-2 text-[0.62rem] tracking-[0.16em] uppercase transition-colors"
        >
          Close
        </button>
      </motion.div>
    </Modal>
  );
}
