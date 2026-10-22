import type { ReactNode } from 'react';
import { BlurFade } from './magicui/blur-fade';

/** The page's one column: wide enough for a two-up, never wider. */
export function Container({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

/**
 * A numbered section: `01 — On the floor`, a hairline, then the content.
 *
 * The numbers are a reading order, not decoration — four sections, read top
 * to bottom, in the order a recruiter asks the questions: can he sell, what
 * has he built, how does he work, how do I reach him.
 */
export function Section({
  id,
  index,
  name,
  children,
}: {
  id: string;
  index: string;
  name: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-label`} className="py-16 sm:py-24">
      <Container>
        <div className="border-ink-700 mb-10 flex items-baseline gap-4 border-t pt-5 sm:mb-14">
          <span className="label tabular-nums">{index}</span>
          <h2 id={`${id}-label`} className="label text-chalk-300!">
            {name}
          </h2>
        </div>
        {children}
      </Container>
    </section>
  );
}

/** Content that settles into place as it scrolls in, once. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <BlurFade
      inView
      inViewMargin="-80px"
      delay={delay}
      offset={10}
      blur="4px"
      duration={0.5}
      className={className}
    >
      {children}
    </BlurFade>
  );
}

/** ↗ for a link that leaves the page. Decorative: the link text says where it goes. */
export function ArrowOut({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={`size-3.5 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M5 11 11 5M6 5h5v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** → for something that opens here. */
export function ArrowRight({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={`size-4 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** The two button weights the page has. */
export const button = {
  primary:
    'inline-flex items-center gap-2 rounded-full bg-chalk-100 px-5 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-white',
  secondary:
    'inline-flex items-center gap-2 rounded-full border border-ink-600 px-5 py-2.5 text-sm font-medium text-chalk-100 transition-colors hover:border-chalk-500 hover:bg-ink-900',
};
