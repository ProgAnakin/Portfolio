import { natureLabel, statusLabel, type Project } from '../data/projects';

/**
 * The card on the shelf edge, shown while a product is hovered or focused.
 *
 * The 3D room had no price tags. The drawn shop has had them all along —
 * `shop/PriceTag` — but in the room you had to click an unlabelled object to
 * find out what it was, which is a lot to ask of someone who came to skim.
 * This is that tag, finally present: what the thing is, whether it shipped,
 * whether it is a company or something built for free, and the one number it
 * can back up. Enough to decide whether to pick it up.
 *
 * Dark glass rather than paper, to match the panel over the counter — two
 * lit surfaces in one room, not a third material.
 */
export function ShelfTalker({ project }: { project: Project }) {
  const soldOut = project.status !== 'in-stock';
  const headline = project.metrics?.[0];

  return (
    <div className="pointer-events-none relative w-max max-w-[16rem] overflow-hidden rounded-[8px] bg-gradient-to-b from-[#12171b]/95 to-[#0b0f12]/96 px-3 pt-2 pb-2.5 ring-1 shadow-[0_14px_34px_rgba(6,9,12,0.7)] ring-white/12 backdrop-blur-[3px]">
      {/* Same bleed as the menu board: what makes a dark rectangle read as lit. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />

      <div className="font-till flex items-center gap-1.5 text-[0.46rem] tracking-[0.18em] uppercase">
        <span
          className="inline-flex items-center gap-1 px-1.5 py-0.5"
          style={{
            backgroundColor: soldOut ? 'transparent' : project.brand.accent,
            border: soldOut ? `1px solid ${project.brand.accent}` : undefined,
            color: soldOut ? project.brand.accent : project.brand.ink,
          }}
        >
          <span aria-hidden="true">{soldOut ? '◷' : '●'}</span>
          {statusLabel[project.status]}
        </span>
        <span className="text-paper-500">{natureLabel[project.nature]}</span>
      </div>

      <p className="text-paper-100 mt-1.5 text-[0.95rem] leading-tight font-semibold">
        {project.name}
      </p>
      <p className="text-paper-500 mt-0.5 text-[0.7rem] leading-snug">{project.tagline}</p>

      {headline && (
        <p className="font-till mt-1.5 text-[0.5rem] tracking-[0.16em] uppercase">
          <span style={{ color: project.brand.accent }}>{headline.value}</span>{' '}
          <span className="text-paper-500">{headline.label}</span>
        </p>
      )}
    </div>
  );
}
