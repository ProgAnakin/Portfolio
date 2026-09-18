import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Project } from '../../data/projects';
import { statusLabel } from '../../data/projects';
import { tintVars } from '../../lib/tints';
import { productArt, productScale } from './products';
import { useShop } from '../../state/ShopContext';

/**
 * One product standing on a shelf.
 *
 * It is a real `<button>` wrapping inline SVG rather than an SVG `<g>` with a
 * click handler: that way it focuses, labels and behaves like a control
 * everywhere, and the drawing stays sharp and interactive.
 */
export function ProductOnShelf({ project }: { project: Project }) {
  const { open } = useShop();
  const prefersReduced = useReducedMotion();
  const [keyboardFocus, setKeyboardFocus] = useState(false);

  const Art = productArt[project.shape];
  const soldOut = project.status === 'out-of-stock';
  const lift = prefersReduced ? 0 : -9;

  return (
    <motion.button
      type="button"
      onClick={() => open(project.id)}
      onFocus={(event) => setKeyboardFocus(event.currentTarget.matches(':focus-visible'))}
      onBlur={() => setKeyboardFocus(false)}
      animate={keyboardFocus ? 'lifted' : 'rest'}
      initial="rest"
      whileHover="lifted"
      whileTap={prefersReduced ? undefined : { y: -3 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="group relative flex h-full cursor-pointer flex-col items-center justify-end rounded-sm bg-transparent p-0"
      aria-label={`${project.name} — ${project.tagline}. ${statusLabel[project.status]}. Open details.`}
      style={tintVars(project.brand.base, !soldOut)}
    >
      {/* The product itself, with its name riding just above it. */}
      <motion.span
        variants={{ rest: { y: 0 }, lifted: { y: lift } }}
        className="relative z-10 flex items-end"
      >
        <motion.span
          variants={{ rest: { opacity: 0, y: 6 }, lifted: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.18 }}
          className="font-sign text-paper-100 pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 text-[0.9rem] whitespace-nowrap sm:text-base"
        >
          {project.name}
        </motion.span>

        <Art
          lit={!soldOut}
          className={[
            'block w-auto drop-shadow-[0_6px_10px_rgba(12,10,9,0.55)]',
            soldOut ? 'opacity-70 saturate-[0.55]' : '',
          ].join(' ')}
          // Height drives the drawing; the width follows the viewBox ratio.
          style={{
            height: `calc(var(--shelf-h) * ${productScale[project.shape]} * ${soldOut ? 0.94 : 1})`,
          }}
        />
      </motion.span>

      {/* Contact shadow on the plank — it tightens as the product lifts. */}
      <motion.span
        aria-hidden="true"
        variants={{
          rest: { scaleX: 1, opacity: 0.55 },
          lifted: { scaleX: 0.82, opacity: 0.78 },
        }}
        className="absolute bottom-0 left-1/2 h-2 w-[72%] -translate-x-1/2 rounded-[50%] bg-[var(--color-ink-900)] blur-[3px]"
      />
    </motion.button>
  );
}
