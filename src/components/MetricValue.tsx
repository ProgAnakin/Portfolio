import { NumberTicker } from './magicui/number-ticker';

/** prefix, the number, suffix — `<60s` splits into `<`, `60`, `s`. */
const PARTS = /^(\D*)(\d+(?:[.,]\d+)?)(.*)$/;

/**
 * A figure that counts up to itself when it scrolls into view.
 *
 * The numbers are the pitch on a sales portfolio, and a number that moves is
 * read. But the values are free text — `76%`, `<60s`, `3` — because they are
 * written by hand in `data/projects` and have to stay that way, so this finds
 * the number inside the string and animates only that. Anything with no digits
 * in it renders as it was written.
 *
 * The moving part is hidden from assistive technology and the real value sits
 * beside it in an `sr-only` span: the ticker rewrites its own text on every
 * frame, and a screen reader handed that reads a slot machine.
 *
 * It keeps `tabular-nums`, which a standalone figure this size would normally
 * not — proportional digits sit better at display sizes. But these digits
 * change sixty times a second on the way up, and proportional ones change
 * width as they go, so the number jitters sideways while it counts and drags
 * its label with it. Every value here is two or three glyphs, where the
 * looseness is not visible; the jitter would be.
 */
export function MetricValue({
  value,
  className,
  style,
}: {
  value: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const parts = PARTS.exec(value);

  if (!parts) {
    return (
      <span className={className} style={style}>
        {value}
      </span>
    );
  }

  const [, prefix, digits, suffix] = parts;
  const decimals = /[.,]/.test(digits) ? digits.split(/[.,]/)[1].length : 0;

  return (
    <span className={className} style={style}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">
        {prefix}
        {/* Faster than the component's default, and started a screen's
            height early: by the time the figure is somewhere a reader is
            looking, it is the figure being claimed and not a number still on
            its way there. */}
        <NumberTicker
          value={Number(digits.replace(',', '.'))}
          decimalPlaces={decimals}
          damping={30}
          stiffness={240}
          inViewMargin="420px"
        />
        {suffix}
      </span>
    </span>
  );
}
