import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Modal } from './Modal';
import type { ProjectMedia as Item } from '../data/media';
import type { Project } from '../data/projects';

/**
 * What a project looks like running, without the page paying for it.
 *
 * Laid out flat — a clip across the card and three stills under it — this cost
 * roughly eight hundred pixels of height per project, on a page whose whole
 * argument is that the shop above it is worth a look. Three projects and the
 * casebook was a scroll nobody finishes.
 *
 * So the card keeps a strip: a few thumbnails, a count, and a way in. The
 * pictures live in a viewer that opens over the page — one screen at a time,
 * with a rail to choose from — and the card itself stays the height of a line
 * of type. Nothing below it moves, because nothing above it grew.
 */
export function ProjectMedia({ project, media }: { project: Project; media: Item[] }) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const prefersReduced = useReducedMotion();

  const clips = media.filter((item) => item.kind === 'video').length;
  const stills = media.length - clips;

  // "1 clip · 3 stills", with whichever half exists.
  const summary = [
    clips > 0 ? `${clips} ${clips === 1 ? 'clip' : 'clips'}` : null,
    stills > 0 ? `${stills} ${stills === 1 ? 'still' : 'stills'}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="px-6 sm:px-8">
      <button
        type="button"
        onClick={() => setOpenAt(0)}
        aria-label={`See ${project.name} running — ${summary}`}
        className="border-ink-500 hover:border-paper-500/60 focus-visible:border-paper-500/60 group flex w-full cursor-pointer items-center gap-3 border px-3 py-2.5 text-left transition-colors"
      >
        {/* A rectangle that insinuates what is inside, rather than a button
            that only claims it. Five at most: past that they stop reading as
            individual things and start reading as texture. */}
        <span aria-hidden="true" className="flex shrink-0 -space-x-2">
          {media.slice(0, 5).map((item) => (
            <span
              key={item.src}
              className="border-ink-800 bg-ink-900 block size-9 overflow-hidden rounded-[3px] border-2"
            >
              {item.kind === 'video' ? (
                <span
                  className="flex size-full items-center justify-center text-[0.6rem] leading-none"
                  style={{ backgroundColor: project.brand.base, color: project.brand.paper }}
                >
                  ▶
                </span>
              ) : (
                <img
                  src={item.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                />
              )}
            </span>
          ))}
        </span>

        <span className="font-till text-paper-500 group-hover:text-paper-300 min-w-0 grow text-[0.56rem] tracking-[0.16em] uppercase transition-colors">
          See it running
          <span className="mt-0.5 block opacity-70">{summary}</span>
        </span>

        <span
          aria-hidden="true"
          className="font-till text-paper-500 group-hover:text-accent shrink-0 text-[0.7rem] transition-colors"
        >
          ↗
        </span>
      </button>

      <AnimatePresence>
        {openAt !== null && (
          <Viewer
            key="viewer"
            project={project}
            media={media}
            start={openAt}
            reduced={Boolean(prefersReduced)}
            onClose={() => setOpenAt(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * The viewer: one screen, and a rail to pick what goes on it.
 *
 * The stage is a fixed box whatever is on it, so switching from a wide
 * dashboard to a phone screenshot does not resize the window under the
 * pointer. Only the current item is mounted, which is also how the video
 * stops when you move off it.
 */
function Viewer({
  project,
  media,
  start,
  reduced,
  onClose,
}: {
  project: Project;
  media: Item[];
  start: number;
  reduced: boolean;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(start);
  const item = media[index] ?? media[0];

  const step = useCallback(
    (by: number) => setIndex((at) => (at + by + media.length) % media.length),
    [media.length],
  );

  useEffect(() => {
    // Escape and Tab belong to the modal; the arrows are ours.
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        step(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        step(-1);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [step]);

  const label = item.caption ? `${project.name} — ${item.caption}` : project.name;

  return (
    <Modal
      onClose={onClose}
      labelledBy="viewer-title"
      className="relative z-10 w-full max-w-5xl px-3 py-4 sm:px-4 sm:py-8"
    >
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        // An explicit exit, because without one `AnimatePresence` falls back
        // to waiting on whatever else is unmounting and the viewer hung about
        // for a second after Close. A dismissal has to look dismissed.
        exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
        transition={{ duration: reduced ? 0 : 0.18 }}
        className="bg-ink-700 border-ink-500 overflow-hidden border shadow-[0_24px_60px_rgba(6,5,4,0.7)]"
      >
        <header
          className="flex items-center justify-between gap-3 px-3 py-2"
          style={{ backgroundColor: project.brand.base, color: project.brand.paper }}
        >
          <p id="viewer-title" className="font-till truncate text-[0.58rem] tracking-[0.16em] uppercase">
            {project.name}
            <span className="opacity-70"> — {media.length === 1 ? 'one item' : `${index + 1} / ${media.length}`}</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close the viewer"
            className="shrink-0 cursor-pointer px-2 text-base leading-none opacity-75 transition-opacity hover:opacity-100"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </header>

        {/* The screen. Fixed box, letterboxed: a portrait phone shot and a wide
            dashboard get the same frame, so the window never jumps. */}
        <div className="bg-ink-900 relative flex aspect-video max-h-[60svh] w-full items-center justify-center">
          {item.kind === 'video' ? (
            <video
              key={item.src}
              src={`${item.src}#t=0.1`}
              controls
              loop
              playsInline
              preload="metadata"
              className="max-h-full max-w-full"
            />
          ) : (
            <img
              key={item.src}
              src={item.src}
              alt={label}
              decoding="async"
              className="max-h-full max-w-full object-contain"
            />
          )}

          {media.length > 1 && (
            <>
              <ViewerArrow side="left" onClick={() => step(-1)} />
              <ViewerArrow side="right" onClick={() => step(1)} />
            </>
          )}
        </div>

        <p className="font-till text-paper-300 px-3 pt-2.5 text-[0.58rem] tracking-[0.14em] uppercase">
          {item.caption || 'Untitled'}
        </p>

        {media.length > 1 && (
          <ul className="flex gap-2 overflow-x-auto px-3 pt-2.5 pb-3">
            {media.map((thumb, at) => (
              <li key={thumb.src}>
                <button
                  type="button"
                  onClick={() => setIndex(at)}
                  aria-label={thumb.caption || `Item ${at + 1}`}
                  aria-current={at === index || undefined}
                  className="block size-12 shrink-0 cursor-pointer overflow-hidden border transition-colors sm:size-14"
                  style={{
                    borderColor: at === index ? project.brand.accent : 'var(--color-ink-500)',
                  }}
                >
                  {thumb.kind === 'video' ? (
                    <span
                      aria-hidden="true"
                      className="flex size-full items-center justify-center text-[0.65rem] leading-none"
                      style={{ backgroundColor: project.brand.base, color: project.brand.paper }}
                    >
                      ▶
                    </span>
                  ) : (
                    <img
                      src={thumb.src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </Modal>
  );
}

function ViewerArrow({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Previous' : 'Next'}
      className={`bg-ink-900/70 text-paper-100 hover:bg-ink-900/90 absolute top-1/2 ${
        side === 'left' ? 'left-2' : 'right-2'
      } flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-sm transition-colors`}
    >
      <span aria-hidden="true">{side === 'left' ? '‹' : '›'}</span>
    </button>
  );
}
