/**
 * One zero-sized SVG holding every filter and gradient the scene shares.
 *
 * Keeping them in a single document node means the wobble on a shelf plank and
 * the wobble on a cardboard box come from the same turbulence, which is what
 * makes the whole drawing look like one hand made it.
 *
 * Note: it is sized 0x0 and clipped rather than `display: none`, because a
 * hidden subtree drops filter references in some engines.
 */
export function SceneDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      className="pointer-events-none absolute"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        {/* Hand-drawn wobble. Everything structural wears this. */}
        <filter id="rough" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* A looser hand, for outlines and signage. */}
        <filter id="rough-loose" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" seed="19" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* Chalk: erodes the edge of a stroke so it looks dragged, not drawn. */}
        <filter id="chalk" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* The warm pool that falls out of an under-shelf strip. */}
        <radialGradient id="shelf-pool" cx="50%" cy="0%" r="82%">
          <stop offset="0%" stopColor="var(--color-amber-300)" stopOpacity="0.55" />
          <stop offset="42%" stopColor="var(--color-amber-400)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--color-amber-400)" stopOpacity="0" />
        </radialGradient>

        {/* The cone under the pendant lamp over the counter. */}
        <linearGradient id="lamp-cone" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="var(--color-amber-200)" stopOpacity="0.30" />
          <stop offset="55%" stopColor="var(--color-amber-400)" stopOpacity="0.10" />
          <stop offset="100%" stopColor="var(--color-amber-400)" stopOpacity="0" />
        </linearGradient>

        {/* A plank, lit along its front lip and falling away into the dark. */}
        <linearGradient id="plank-face" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--color-oak-300)" />
          <stop offset="38%" stopColor="var(--color-oak-500)" />
          <stop offset="100%" stopColor="var(--color-oak-700)" />
        </linearGradient>

        <linearGradient id="plank-top" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--color-oak-700)" />
          <stop offset="100%" stopColor="var(--color-oak-500)" />
        </linearGradient>

        {/* Brushed metal, for the till and the shelf uprights. */}
        <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-ink-500)" />
          <stop offset="45%" stopColor="#4a4240" />
          <stop offset="100%" stopColor="var(--color-ink-600)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
