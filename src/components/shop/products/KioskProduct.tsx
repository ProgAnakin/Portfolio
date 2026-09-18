import type { ProductArtProps } from './types';

/** A tablet on a weighted kiosk stand, screen mid-swipe. */
export function KioskProduct({ lit, className, style }: ProductArtProps) {
  return (
    <svg viewBox="0 0 120 172" className={className} style={style} aria-hidden="true" focusable="false">
      <g filter="url(#rough)">
        {/* Stand */}
        <path d="M31 160c0-5 3-8 8-8h42c5 0 8 3 8 8l1 5H30z" fill="var(--p-edge)" />
        <rect x="53" y="98" width="14" height="56" rx="3" fill="var(--p-dark)" />
        <rect x="53" y="98" width="4" height="56" fill="var(--p-base)" opacity="0.5" />

        {/* Tablet body */}
        <rect x="21" y="12" width="78" height="92" rx="7" fill="var(--p-base)" />
        <rect x="21" y="12" width="78" height="92" rx="7" fill="var(--p-dark)" opacity="0.0" />
        <path d="M92 12h0a7 7 0 0 1 7 7v78a7 7 0 0 1-7 7h-4V12z" fill="var(--p-edge)" />
        <path d="M28 12h4v92h-5a6 6 0 0 1-6-6V19a7 7 0 0 1 7-7z" fill="var(--p-light)" opacity="0.6" />

        {/* Screen — an active kiosk is the brightest thing on its shelf. */}
        <rect x="28" y="19" width="64" height="78" rx="3" fill="var(--color-ink-900)" />
        {lit && (
          <rect
            x="28"
            y="19"
            width="64"
            height="78"
            rx="3"
            fill="var(--color-amber-400)"
            opacity="0.16"
          />
        )}
        {/* The swipe card, tilted, half thrown off the deck */}
        <g opacity={lit ? 1 : 0.4}>
          <rect
            x="37"
            y="31"
            width="42"
            height="48"
            rx="4"
            fill="var(--color-amber-400)"
            transform="rotate(-7 58 55)"
          />
          <rect
            x="43"
            y="39"
            width="30"
            height="3"
            rx="1.5"
            fill="var(--color-ink-900)"
            opacity="0.45"
            transform="rotate(-7 58 55)"
          />
          <rect
            x="43"
            y="46"
            width="20"
            height="3"
            rx="1.5"
            fill="var(--color-ink-900)"
            opacity="0.35"
            transform="rotate(-7 58 55)"
          />
        </g>
        {/* Home button / camera pip */}
        <circle cx="60" cy="15.5" r="1.4" fill="var(--color-ink-900)" opacity="0.6" />
      </g>

      {/* Light catching the top-left edge */}
      {lit && (
        <path
          d="M28 13h60"
          stroke="var(--color-amber-200)"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.5"
          filter="url(#rough)"
        />
      )}
    </svg>
  );
}
