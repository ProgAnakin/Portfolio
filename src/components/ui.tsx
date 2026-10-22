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

/**
 * A page section, laid out like a CV: the section's name in a narrow column on
 * the left, the content on the right. On a phone the name sits on top.
 */
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
      className={night ? 'bg-night text-snow-2' : 'bg-paper text-ink-2'}
    >
      <Container className="py-16 sm:py-24">
        <div
          className={`grid gap-y-8 border-t pt-6 lg:grid-cols-12 lg:gap-x-8 ${
            night ? 'border-night-line' : 'border-line'
          }`}
        >
          <div className="lg:col-span-3">
            <h2
              id={`${id}-name`}
              className={`wide text-[0.8125rem] font-semibold ${night ? 'text-snow' : 'text-ink'}`}
            >
              {name}
            </h2>
            {note && (
              <p className={`mt-2 text-sm ${night ? 'text-snow-3' : 'text-ink-3'}`}>{note}</p>
            )}
          </div>
          <div className="lg:col-span-9">{children}</div>
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
