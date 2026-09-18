import { useMemo } from 'react';
import { projects, SHELF_COUNT, type Project } from '../../data/projects';
import { useShelvedLayout } from '../../hooks/useMediaQuery';
import { LightPool } from './LightPool';
import { EmptyShelfTag, PriceTag } from './PriceTag';
import { ProductOnShelf } from './ProductOnShelf';
import { ShelfPlank } from './ShelfPlank';

/**
 * Groups the inventory into shelves.
 *
 * Wide enough for a real shelf, a shelf is a shelf: several products standing
 * side by side. On a phone the scene does not shrink — it unrolls, one product
 * per shelf section, so each product stays large enough to read while the
 * shelves, tags and lighting all survive the trip.
 */
function buildRows(shelved: boolean): Project[][] {
  const byShelf = Array.from({ length: SHELF_COUNT }, (_, shelf) =>
    projects.filter((project) => project.shelf === shelf).sort((a, b) => a.slot - b.slot),
  );
  if (shelved) return byShelf;
  return byShelf.flatMap((shelf) => (shelf.length ? shelf.map((project) => [project]) : [[]]));
}

function ShelfRow({ items, index }: { items: Project[]; index: number }) {
  const empty = items.length === 0;

  return (
    <li className={`shop-shelf relative ${empty ? 'shop-shelf--empty' : ''}`}>
      <LightPool flickerDelay={index * 1.9} />

      <ul className="relative flex items-stretch justify-center gap-x-6 px-6 sm:justify-start sm:gap-x-14 sm:px-14 lg:gap-x-24 lg:px-16">
        {items.map((project) => (
          <li key={project.id} className="flex flex-col items-center">
            <div className="flex h-[var(--shelf-h)] items-end">
              <ProductOnShelf project={project} />
            </div>
            {/* The plank crosses this gap. */}
            <div aria-hidden="true" className="h-[var(--plank-h)]" />
            <PriceTag project={project} />
          </li>
        ))}

        {empty && (
          <li className="flex flex-col items-center">
            <div aria-hidden="true" className="h-[var(--shelf-h)] w-40 sm:w-56" />
            <div aria-hidden="true" className="h-[var(--plank-h)]" />
            <EmptyShelfTag />
          </li>
        )}
      </ul>

      <ShelfPlank
        className="absolute inset-x-0 z-20 h-[var(--plank-h)] w-full"
        style={{ top: 'var(--shelf-h)' }}
      />
    </li>
  );
}

export function ShelfUnit() {
  const shelved = useShelvedLayout();
  const rows = useMemo(() => buildRows(shelved), [shelved]);

  return (
    <div className="relative">
      {/* The back panel of the gondola — a shade warmer than the wall, so the
          unit reads as a piece of furniture rather than a hole. */}
      <div
        aria-hidden="true"
        className="bg-ink-700 absolute inset-0"
        style={{ boxShadow: 'inset 0 0 70px 14px rgba(12,10,9,0.85)' }}
      />

      {/* Uprights. */}
      <span
        aria-hidden="true"
        className="from-oak-700 via-oak-500 to-oak-700 absolute inset-y-0 left-0 z-30 w-2.5 bg-gradient-to-b sm:w-3.5"
      />
      <span
        aria-hidden="true"
        className="from-oak-700 via-oak-500 to-oak-700 absolute inset-y-0 right-0 z-30 w-2.5 bg-gradient-to-b sm:w-3.5"
      />
      {/* A drawn line down the inside of each upright. */}
      <span
        aria-hidden="true"
        className="bg-ink-900/60 absolute inset-y-0 left-2.5 z-30 w-px sm:left-3.5"
      />
      <span
        aria-hidden="true"
        className="bg-ink-900/60 absolute inset-y-0 right-2.5 z-30 w-px sm:right-3.5"
      />

      <ol className="relative flex flex-col">
        {rows.map((items, index) => (
          <ShelfRow key={items[0]?.id ?? `empty-${index}`} items={items} index={index} />
        ))}
      </ol>
    </div>
  );
}
