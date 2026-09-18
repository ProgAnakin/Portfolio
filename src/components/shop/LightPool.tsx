/**
 * The pool of amber light falling from the strip on the shelf above.
 *
 * Two layers: a hot band right under the lip, and a wide soft wash that fades
 * out before it reaches the next plank. `flickerDelay` staggers the rows so
 * the shop breathes unevenly, the way a row of cheap strip lights does.
 */
export function LightPool({ flickerDelay = 0 }: { flickerDelay?: number }) {
  return (
    <div
      aria-hidden="true"
      className="shop-flicker pointer-events-none absolute inset-x-0 top-0 h-[78%]"
      style={{ animationDelay: `${flickerDelay}s` }}
    >
      {/* The wash on the back panel. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 100% at 50% -6%, rgba(242,192,120,0.30) 0%, rgba(232,163,61,0.13) 34%, rgba(232,163,61,0.03) 62%, transparent 82%)',
        }}
      />
      {/* The hot line directly under the lip. */}
      <div
        className="absolute inset-x-0 top-0 h-10"
        style={{
          background:
            'linear-gradient(to bottom, rgba(248,220,174,0.24), rgba(232,163,61,0.06) 58%, transparent)',
        }}
      />
    </div>
  );
}
