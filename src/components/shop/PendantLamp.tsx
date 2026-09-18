import { motion, useReducedMotion } from 'framer-motion';

/** The lamp over the counter, and the cone of light it drops. */
export function PendantLamp({ className }: { className?: string }) {
  const prefersReduced = useReducedMotion();

  return (
    <div aria-hidden="true" className={className}>
      <svg
        viewBox="0 0 320 420"
        preserveAspectRatio="xMidYMin meet"
        className="h-full w-full"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* Light has no edges. */}
          <filter id="lamp-soften" x="-30%" y="-15%" width="160%" height="130%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>
        {/* The cone of light, reaching the counter top. */}
        <motion.path
          d="M160 74 44 400h232z"
          fill="url(#lamp-cone)"
          filter="url(#lamp-soften)"
          animate={prefersReduced ? undefined : { opacity: [0.9, 1, 0.86, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <g filter="url(#rough)">
          {/* Flex and shade. */}
          <path d="M159 0v40h2V0z" fill="var(--color-ink-500)" />
          <path d="M160 40 122 76h76z" fill="var(--color-ink-600)" />
          <path d="M160 40 146 76h-24z" fill="var(--color-ink-500)" opacity="0.7" />
          <ellipse cx="160" cy="76" rx="38" ry="7" fill="var(--color-amber-400)" opacity="0.45" />
        </g>
        {/* Bulb. */}
        <circle cx="160" cy="76" r="8" fill="var(--color-amber-200)" />
        <circle cx="160" cy="76" r="20" fill="var(--color-amber-300)" opacity="0.28" />
      </svg>
    </div>
  );
}
