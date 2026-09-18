/**
 * A shelf plank: top surface, front lip, and the LED strip tucked under the
 * lip that does all the lighting in this shop.
 *
 * Drawn with `preserveAspectRatio="none"` so it can span any shelf width —
 * every band is horizontal, so the stretch is invisible.
 */
export function ShelfPlank({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 1000 44"
      preserveAspectRatio="none"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <g filter="url(#rough)">
        {/* Top surface — what the products stand on. */}
        <rect x="0" y="0" width="1000" height="7" fill="url(#plank-top)" />
        {/* Front lip. */}
        <rect x="0" y="6" width="1000" height="22" fill="url(#plank-face)" />
        {/* A drawn line where the two planes meet. */}
        <rect x="0" y="6" width="1000" height="1.2" fill="var(--color-ink-900)" opacity="0.45" />
        {/* Underside, in shadow. */}
        <rect x="0" y="28" width="1000" height="9" fill="var(--color-ink-900)" opacity="0.72" />
      </g>
      {/* The strip itself. */}
      <rect x="14" y="29" width="972" height="2.6" rx="1.3" fill="var(--color-amber-300)" opacity="0.85" />
      <rect x="14" y="29" width="972" height="6" rx="3" fill="var(--color-amber-400)" opacity="0.28" />
    </svg>
  );
}
