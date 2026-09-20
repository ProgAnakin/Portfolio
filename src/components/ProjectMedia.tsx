import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Modal } from './Modal';
import type { ProjectMedia as Item } from '../data/media';
import type { Project } from '../data/projects';

/**
 * The part of a project a shelf cannot hold: the thing actually running.
 *
 * Laid out for what a project usually has — one clip and about three stills —
 * rather than as a carousel. A horizontal strip looked tidy and hid two thirds
 * of the evidence behind a swipe nobody performs: the visitor who scrolled
 * this far wants to see the work, not to operate a gallery. So the clip takes
 * the full width at the top and the stills sit in a row under it, all visible
 * at once, each one a button that opens it big enough to read.
 */
export function ProjectMedia({ project, media }: { project: Project; media: Item[] }) {
  const [zoomed, setZoomed] = useState<Item | null>(null);
  const prefersReduced = useReducedMotion();

  const clips = media.filter((item) => item.kind === 'video');
  const shots = media.filter((item) => item.kind === 'image');

  // Three across is the shape this is built for; two and one get their own so
  // a single still is never a third of a row with two holes beside it.
  const columns =
    shots.length === 1 ? 'grid-cols-1' : shots.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3';

  return (
    <div className="border-ink-500 space-y-3 border-b p-3">
      {clips.map((clip) => (
        <figure key={clip.src}>
          <div className="bg-ink-900 border-ink-500/70 overflow-hidden border">
            <video
              // `#t=0.1` makes a browser paint the first frame instead of a
              // black rectangle, with no autoplay and nothing downloaded past
              // the metadata until someone presses play.
              src={`${clip.src}#t=0.1`}
              controls
              loop
              muted
              playsInline
              preload="metadata"
              className="block aspect-video w-full"
            />
          </div>
          {clip.caption && (
            <figcaption className="font-till text-paper-500 mt-2 px-0.5 text-[0.56rem] tracking-[0.14em] uppercase">
              {clip.caption}
            </figcaption>
          )}
        </figure>
      ))}

      {shots.length > 0 && (
        <ul className={`grid gap-3 ${columns}`}>
          {shots.map((shot) => {
            const label = shot.caption
              ? `${project.name} — ${shot.caption}`
              : `${project.name} screenshot`;

            return (
              <li key={shot.src}>
                <button
                  type="button"
                  onClick={() => setZoomed(shot)}
                  aria-label={`${label}. Open it full size.`}
                  className="group block w-full cursor-pointer text-left"
                >
                  <div className="bg-ink-900 border-ink-500/70 group-hover:border-paper-500/60 overflow-hidden border transition-colors">
                    <img
                      src={shot.src}
                      alt={label}
                      loading="lazy"
                      decoding="async"
                      // Never cropped: the top of a dashboard is usually the
                      // part worth seeing.
                      className="block aspect-[16/10] w-full object-contain"
                    />
                  </div>
                  {shot.caption && (
                    <span className="font-till text-paper-500 group-hover:text-paper-300 mt-2 block px-0.5 text-[0.54rem] tracking-[0.14em] uppercase transition-colors">
                      {shot.caption}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <AnimatePresence>
        {zoomed && (
          <Modal
            key="zoom"
            onClose={() => setZoomed(null)}
            labelledBy="zoom-caption"
            className="relative z-10 w-full max-w-6xl px-4 py-8 sm:py-12"
          >
            <motion.figure
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReduced ? 0 : 0.2 }}
            >
              <img
                src={zoomed.src}
                alt={
                  zoomed.caption ? `${project.name} — ${zoomed.caption}` : `${project.name} screenshot`
                }
                className="border-ink-500 mx-auto block max-h-[78svh] w-auto max-w-full border"
              />
              <figcaption
                id="zoom-caption"
                className="font-till text-paper-300 mt-3 flex flex-wrap items-center justify-between gap-3 text-[0.58rem] tracking-[0.16em] uppercase"
              >
                <span>
                  {project.name}
                  {zoomed.caption ? ` — ${zoomed.caption}` : ''}
                </span>
                <button
                  type="button"
                  onClick={() => setZoomed(null)}
                  className="border-paper-500/50 hover:border-accent hover:text-accent cursor-pointer border px-3 py-2 transition-colors"
                >
                  Close
                </button>
              </figcaption>
            </motion.figure>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
