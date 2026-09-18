/** The counter itself: a worn wooden block with a lit front edge. */
export function CounterBlock({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 150"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g filter="url(#rough)">
        {/* Counter top. */}
        <rect x="0" y="0" width="800" height="14" fill="url(#plank-top)" />
        {/* The front edge, catching the lamp. */}
        <rect x="0" y="12" width="800" height="6" fill="var(--color-oak-300)" opacity="0.9" />
        {/* Front panel. */}
        <rect x="0" y="18" width="800" height="132" fill="var(--color-oak-700)" />
        <rect x="0" y="18" width="800" height="132" fill="var(--color-ink-900)" opacity="0.35" />
      </g>
      {/* Bounce off the counter top, pooling under the lamp. */}
      <ellipse cx="520" cy="18" rx="290" ry="52" fill="url(#shelf-pool)" opacity="0.5" />
      {/* Panel grooves. */}
      <g stroke="var(--color-ink-900)" strokeWidth="2" opacity="0.5">
        <path d="M120 34v104M280 34v104M440 34v104M600 34v104" />
      </g>
      <rect x="0" y="30" width="800" height="1.5" fill="var(--color-ink-900)" opacity="0.55" />
    </svg>
  );
}
