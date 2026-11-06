import type { ReactNode } from 'react';

/** The page's one column. */
export function Container({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-5 sm:px-8 ${className}`}>{children}</div>
  );
}

/** A numbered section header keeps the long page easy to scan. */
export function Section({
  id,
  name,
  note,
  tone = 'paper',
  children,
}: {
  id: string;
  name: string;
  /** A short line under the name: a period, a count. */
  note?: string;
  tone?: 'paper' | 'night';
  children: ReactNode;
}) {
  const night = tone === 'night';
  return (
    <section
      id={id}
      aria-labelledby={`${id}-name`}
      className={night ? 'bg-night text-snow-2' : id === 'work' ? 'bg-paper-2 text-ink-2' : 'bg-paper text-ink-2'}
    >
      <Container className="py-16 sm:py-24">
        <div
          className={`border-t pt-5 ${
            night ? 'border-night-line' : 'border-line'
          }`}
        >
          <div className="mb-10 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 sm:mb-14">
            <h2
              id={`${id}-name`}
              className={`eyebrow flex items-center gap-4 ${night ? 'text-snow' : 'text-ink'}`}
            >
              <span className={night ? 'text-accent' : 'text-accent-dark'} aria-hidden="true">
                {{ record: '01', work: '02', method: '03', contact: '04' }[id]}
              </span>
              {name}
            </h2>
            {note && (
              <p className={`text-sm ${night ? 'text-snow-3' : 'text-ink-3'}`}>{note}</p>
            )}
          </div>
          <div>{children}</div>
        </div>
      </Container>
    </section>
  );
}

/** ↗ for a link that leaves the page. Decorative: the link text says where. */
export function ArrowOut({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={`size-3.5 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M5 11 11 5M6 5h5v5" />
    </svg>
  );
}

/** → for something that opens here. */
export function ArrowRight({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={`size-4 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M2.5 8h11M9.5 4l4 4-4 4" />
    </svg>
  );
}

/**
 * Buttons are rectangles with square corners: the page's only shapes are
 * rules and blocks, and a pill would be the one rounded thing on it.
 */
export const button = {
  /** White on the black covers. */
  light:
    'inline-flex items-center gap-3 bg-snow px-5 py-3 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-white',
  /** Black on the white pages. */
  dark: 'inline-flex items-center gap-3 bg-ink px-5 py-3 text-[0.9375rem] font-medium text-paper transition-colors hover:bg-black',
  /** A text link with a rule under it. */
  link: 'inline-flex items-center gap-2 border-b border-current pb-0.5 text-[0.9375rem] font-medium',
};
