import { menu, profile } from '../../data/profile';

/**
 * The board on the wall behind the counter. "About me", written the way a
 * small shop writes what it can do for you.
 */
export function Chalkboard() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative mx-auto w-full max-w-md scroll-mt-24"
    >
      {/* Frame */}
      <svg
        viewBox="0 0 400 260"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      >
        <g filter="url(#rough)">
          <rect x="2" y="2" width="396" height="256" rx="4" fill="var(--color-oak-700)" />
          <rect x="10" y="10" width="380" height="240" rx="2" fill="#191d1b" />
          <rect x="10" y="10" width="380" height="240" rx="2" fill="var(--color-ink-900)" opacity="0.35" />
        </g>
        {/* A ghost of everything wiped off before today. */}
        <g stroke="var(--color-paper-100)" strokeWidth="6" opacity="0.035" strokeLinecap="round">
          <path d="M28 70q80 22 160-6t180 14" />
          <path d="M24 170q120-28 210 8t130-16" />
        </g>
      </svg>

      <div className="relative px-7 py-6 sm:px-9 sm:py-7">
        <h2
          id="about-heading"
          className="font-sign text-paper-100/90 text-center text-xl tracking-[0.06em] sm:text-2xl"
          style={{ textShadow: '0 0 12px rgba(237,230,218,0.18)' }}
        >
          Today&rsquo;s menu
        </h2>
        <p className="font-till text-paper-500 mt-1 text-center text-[0.55rem] tracking-[0.22em] uppercase">
          {profile.location}
        </p>

        <dl className="mt-4 space-y-3">
          {menu.map((item) => (
            <div key={item.name}>
              <div className="flex items-baseline gap-2">
                <dt className="text-paper-100/85 text-[0.92rem] leading-snug">{item.name}</dt>
                <span
                  aria-hidden="true"
                  className="border-paper-500/30 mb-1 grow border-b border-dotted"
                />
                <span className="font-till text-paper-500 shrink-0 text-[0.55rem] tracking-[0.14em]">
                  {item.price}
                </span>
              </div>
              <dd className="text-paper-500 mt-0.5 text-[0.8rem] leading-snug">{item.note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
