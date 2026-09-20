import { natureShort, type Project, type ProjectStatus } from '../../data/projects';

/**
 * The card clipped to the shelf edge under a product.
 *
 * In stock: a plain price tag with what it is and when. Out of stock: the
 * accent colour and the only shouting anywhere in the shop.
 */
export function PriceTag({ project }: { project: Project }) {
  const soldOut = project.status === 'out-of-stock';

  return (
    <span
      aria-hidden="true"
      className={[
        'font-till relative -mt-px inline-flex flex-col items-center px-2 py-1 text-center',
        'text-[0.5rem] leading-[1.35] tracking-[0.12em] uppercase sm:text-[0.56rem]',
        'origin-top select-none',
        soldOut
          ? 'bg-accent/12 text-accent border border-dashed border-current/50 -rotate-[1.4deg]'
          : 'bg-paper-100/8 text-paper-500 border-ink-500/70 border rotate-[0.9deg]',
      ].join(' ')}
    >
      {/* The pin it hangs from. */}
      <span
        className={[
          'absolute -top-[5px] left-1/2 h-[5px] w-px -translate-x-1/2',
          soldOut ? 'bg-accent/70' : 'bg-ink-500',
        ].join(' ')}
      />
      <span className={soldOut ? 'font-bold' : ''}>
        {soldOut ? 'OUT OF STOCK' : project.tag.kind}
      </span>
      <span className="opacity-70">{project.tag.year}</span>
      {/* Whether this is a company or something built for free. On the tag
          rather than on the shelf edge because the shelf holds whatever fits,
          not whatever matches — see `data/shelving`. */}
      <span aria-hidden="true" className="mt-1 mb-0.5 h-px w-full bg-current opacity-25" />
      <span className="text-[0.44rem] tracking-[0.14em] opacity-60 sm:text-[0.48rem]">
        {natureShort[project.nature]}
      </span>
    </span>
  );
}

/** The tag on a shelf with nothing on it yet. */
export function EmptyShelfTag({ status = 'restocking' }: { status?: ProjectStatus }) {
  return (
    <span
      aria-hidden="true"
      className="font-till border-ink-500/60 text-paper-500/70 inline-flex -rotate-[1.2deg] border border-dashed px-2.5 py-1 text-[0.5rem] tracking-[0.14em] uppercase sm:text-[0.56rem]"
    >
      {status === 'restocking' ? 'Restocking soon' : status}
    </span>
  );
}
