import { mediaFor } from '../data/media';
import type { Project } from '../data/projects';

/**
 * A banner across the top of a card, when there is a screenshot to put in one.
 *
 * Deliberately a crop: a banner is a shape, and the full picture is one click
 * away in the viewer. It takes the top of the image rather than the middle,
 * because the top of an interface is the part that says what the interface is.
 *
 * Nothing renders until a still exists. The branded header underneath does the
 * work in the meantime — see the watermark in `ProjectDetail` — so a project
 * with no screenshots yet has a card with no gap in it rather than an empty
 * rectangle announcing what is missing.
 */
export function ProjectCover({ project }: { project: Project }) {
  const still = mediaFor(project.id).find((item) => item.kind === 'image');
  if (!still) return null;

  return (
    <div className="bg-ink-900 relative aspect-[21/9] overflow-hidden">
      <img
        src={still.src}
        alt={still.caption ? `${project.name} — ${still.caption}` : `${project.name} in use`}
        loading="lazy"
        decoding="async"
        className="size-full object-cover object-top"
      />
      {/* Melts into the branded header below, so the two read as one piece
          rather than a photograph sitting on a coloured block. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{ background: `linear-gradient(to bottom, transparent, ${project.brand.base})` }}
      />
    </div>
  );
}
