import type { ProductArtProps } from './types';

/** A taped cardboard box, never opened. Printed with a handset. */
export function CrateProduct({ lit, className, style }: ProductArtProps) {
  return (
    <svg viewBox="0 0 142 124" className={className} style={style} aria-hidden="true" focusable="false">
      <g filter="url(#rough)">
        {/* Top face */}
        <path d="M18 30 38 14h86l-20 16z" fill="var(--p-light)" opacity="0.85" />
        {/* Side */}
        <path d="M104 30 124 14v76l-20 14z" fill="var(--p-edge)" />
        {/* Front */}
        <path d="M18 30h86v74H18z" fill="var(--p-base)" />

        {/* Packing tape down the seam */}
        <path d="M57 14 37 30v74h12V30l20-16z" fill="var(--color-paper-100)" opacity="0.12" />
        <path d="M18 30h86" stroke="var(--color-ink-900)" strokeWidth="1.6" opacity="0.35" />

        {/* Stencilled handset */}
        <g opacity={lit ? 0.6 : 0.35} stroke="var(--color-ink-900)" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M60 52c0-9 7-16 16-16s16 7 16 16" />
          <rect x="56" y="52" width="9" height="14" rx="3" fill="var(--color-ink-900)" strokeWidth="0" />
          <rect x="87" y="52" width="9" height="14" rx="3" fill="var(--color-ink-900)" strokeWidth="0" />
        </g>

        {/* Fragile-style hand-scrawled marks */}
        <path
          d="M30 86h24M30 93h14"
          stroke="var(--color-ink-900)"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.3"
        />
      </g>
    </svg>
  );
}
