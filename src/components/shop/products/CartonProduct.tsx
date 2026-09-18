import type { ProductArtProps } from './types';

/** A tall gable-top carton. Spare shape for future stock. */
export function CartonProduct({ lit, className, style }: ProductArtProps) {
  return (
    <svg viewBox="0 0 100 164" className={className} style={style} aria-hidden="true" focusable="false">
      <g filter="url(#rough)">
        <path d="M24 44 50 18l26 26v100H24z" fill="var(--p-base)" />
        <path d="M50 18l26 26v100H62V40z" fill="var(--p-edge)" />
        <path d="M24 44h52" stroke="var(--color-ink-900)" strokeWidth="1.6" opacity="0.32" />
        <rect x="32" y="70" width="36" height="40" fill="var(--color-paper-100)" opacity={lit ? 0.45 : 0.26} />
        <path
          d="M39 84h22M39 93h14"
          stroke="var(--color-ink-900)"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.35"
        />
      </g>
    </svg>
  );
}
