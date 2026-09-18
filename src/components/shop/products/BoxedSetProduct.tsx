import type { ProductArtProps } from './types';

/** A boxed set, three-quarter view. Printed with a ball and pool lanes. */
export function BoxedSetProduct({ lit, className, style }: ProductArtProps) {
  return (
    <svg viewBox="0 0 150 146" className={className} style={style} aria-hidden="true" focusable="false">
      <g filter="url(#rough)">
        {/* Top face */}
        <path d="M24 34 46 16h82l-22 18z" fill="var(--p-light)" />
        {/* Side face */}
        <path d="M106 34 128 16v92l-22 18z" fill="var(--p-edge)" />
        {/* Front face */}
        <path d="M24 34h82v92H24z" fill="var(--p-base)" />

        {/* Printed artwork: lanes and a ball */}
        <g opacity={lit ? 0.85 : 0.45}>
          <path d="M32 96h66M32 106h66M32 116h66" stroke="var(--color-ink-900)" strokeWidth="2" opacity="0.32" />
          <circle cx="65" cy="66" r="19" fill="var(--color-amber-400)" opacity="0.92" />
          <path
            d="M65 47v38M46 66h38"
            stroke="var(--color-ink-900)"
            strokeWidth="2"
            opacity="0.4"
          />
        </g>

        {/* Title band */}
        <rect x="32" y="42" width="44" height="6" rx="3" fill="var(--color-paper-100)" opacity="0.55" />
      </g>

      {lit && (
        <path
          d="M25 35h80"
          stroke="var(--color-amber-200)"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.45"
          filter="url(#rough)"
        />
      )}
    </svg>
  );
}
