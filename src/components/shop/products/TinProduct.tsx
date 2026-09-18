import type { ProductArtProps } from './types';

/** A cylindrical tin with a paper label. Spare shape for future stock. */
export function TinProduct({ lit, className, style }: ProductArtProps) {
  return (
    <svg viewBox="0 0 100 136" className={className} style={style} aria-hidden="true" focusable="false">
      <g filter="url(#rough)">
        <path d="M22 26h56v84a28 9 0 0 1-56 0z" fill="var(--p-base)" />
        <path d="M64 26h14v84a17 9 0 0 1-14 8z" fill="var(--p-edge)" opacity="0.8" />
        <ellipse cx="50" cy="26" rx="28" ry="9" fill="var(--p-light)" />
        <ellipse cx="50" cy="26" rx="20" ry="6" fill="var(--p-dark)" opacity="0.5" />
        <rect x="22" y="52" width="56" height="34" fill="var(--color-paper-100)" opacity={lit ? 0.5 : 0.3} />
        <path
          d="M31 64h38M31 72h26"
          stroke="var(--color-ink-900)"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.35"
        />
      </g>
    </svg>
  );
}
