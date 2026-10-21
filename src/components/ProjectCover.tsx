import { mediaFor } from '../data/media';
import type { Project } from '../data/projects';
import { Safari } from './magicui/safari';

/** The address to print in the frame's bar — the project's own, when it has one. */
function hostOf(project: Project): string | undefined {
  const href = project.links[0]?.href;
  if (!href) return undefined;
  try {
    return new URL(href).host.replace(/^www\./, '');
  } catch {
    return undefined;
  }
}

/**
 * The shot across the top of a card, in a browser window.
 *
 * A screenshot on its own is a cropped rectangle and reads as one. The same
 * screenshot inside a browser chrome, on the project's own colour, reads as a
 * product that exists somewhere — which is the claim being made, and the frame
 * carries the address to back it up. Both of these are live sites; the frame
 * is a photograph of that, not a prop.
 *
 * Nothing renders until a still exists. The branded header underneath does the
 * work in the meantime — see the watermark in `ProjectDetail` — so a project
 * with no screenshots yet has a card with no gap in it rather than an empty
 * rectangle announcing what is missing.
 */
export function ProjectCover({ project }: { project: Project }) {
  const still = mediaFor(project.id).find((item) => item.kind === 'image');
  if (!still) return null;

  const { brand } = project;

  return (
    <div
      // Fixed height, and the window is clipped by it. A full browser frame at
      // card width is seven hundred pixels — the whole card, for one picture.
      // Cropped to a band you get the chrome, the address and the top of the
      // app, which is all the frame was ever for.
      className="relative h-52 overflow-hidden px-6 pt-6 sm:h-64 sm:px-10 sm:pt-8"
      style={{
        background: `linear-gradient(170deg, color-mix(in oklab, ${brand.base} 52%, ${brand.ink}) 0%, color-mix(in oklab, ${brand.base} 82%, ${brand.ink}) 100%)`,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `repeating-linear-gradient(126deg, transparent 0 15px, ${brand.accent}10 15px 16px)`,
        }}
      />

      {/* Runs off the bottom into the header, which is what stops it reading
          as a floating sticker. */}
      <div className="relative">
        <Safari
          url={hostOf(project)}
          imageSrc={still.src}
          className="w-full drop-shadow-[0_18px_40px_rgba(6,5,4,0.55)]"
        />
      </div>
    </div>
  );
}
