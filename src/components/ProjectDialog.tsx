import { useEffect, useRef, useState } from 'react';
import { mediaFor, type ProjectMedia } from '../data/media';
import { natureLabel, type Project } from '../data/projects';
import { MetricValue } from './MetricValue';
import { ArrowOut } from './ui';

/**
 * A project's case, over the page.
 *
 * The main page stays short — a recruiter scanning it sees four lines of work,
 * not four screens — and the detail is one click away for the one they care
 * about. A native `<dialog>`, opened with `showModal()`: it traps focus, closes
 * on Escape, makes the page behind it inert and hands focus back to whatever
 * opened it, all without a line of code here doing any of that.
 */
export function ProjectDialog({
  project,
  startAt,
  onClose,
}: {
  project: Project | null;
  startAt: number;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // A click on the backdrop lands on the dialog element itself.
      onClick={(event) => event.target === event.currentTarget && ref.current?.close()}
      aria-labelledby="case-name"
      className="bg-ink-950 text-chalk-300 border-ink-700 m-auto h-full max-h-none w-full max-w-none overflow-y-auto border p-0 backdrop:bg-black/80 sm:h-[min(92vh,980px)] sm:w-[min(94vw,1100px)] sm:rounded-3xl"
    >
      {project && (
        <CaseBody
          key={project.id}
          project={project}
          startAt={startAt}
          onClose={() => ref.current?.close()}
        />
      )}
    </dialog>
  );
}

function CaseBody({
  project,
  startAt,
  onClose,
}: {
  project: Project;
  startAt: number;
  onClose: () => void;
}) {
  const media = mediaFor(project.id);

  return (
    <article>
      {/* The brand's colour, once — the project has been opened, so it gets to
          be itself. Everything else stays in the page's greys. */}
      <div aria-hidden="true" className="h-1" style={{ background: project.accent }} />

      <header className="bg-ink-950/90 border-ink-700 sticky top-0 z-10 flex items-center justify-between gap-4 border-b px-5 py-4 backdrop-blur sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={project.logo}
            alt=""
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-[22%] object-contain"
          />
          <p className="label truncate">
            {natureLabel[project.nature]} · {project.year}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          // Autofocus the way out rather than the first link, so a keyboard
          // user lands somewhere harmless and a screen reader starts at the top.
          autoFocus
          className="border-ink-600 text-chalk-100 hover:bg-ink-800 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm"
        >
          Close
          <span aria-hidden="true" className="text-chalk-500 hidden sm:inline">
            Esc
          </span>
        </button>
      </header>

      <div className="px-5 pt-8 pb-12 sm:px-8 sm:pt-10">
        <h2 id="case-name" className="font-display text-chalk-100 text-4xl sm:text-6xl">
          {project.name}
        </h2>
        <p className="text-chalk-100 mt-3 text-lg sm:text-xl">{project.tagline}</p>
        <p className="text-chalk-500 mt-2 text-sm">{project.status}</p>

        {media.length > 0 && <Gallery media={media} startAt={startAt} name={project.name} />}

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-8 lg:col-span-7">
            <Block title="The problem">{project.problem}</Block>
            <Block title="What it does">{project.solution}</Block>
            {project.outcome && <Block title="Where it stands">{project.outcome}</Block>}
          </div>

          <aside className="space-y-8 lg:col-span-4 lg:col-start-9">
            <Block title="My role">{project.role}</Block>

            {project.metrics && (
              <div>
                <h3 className="label">In numbers</h3>
                <dl className="mt-3 space-y-4">
                  {project.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="border-ink-700 flex items-baseline gap-4 border-t pt-3"
                    >
                      <dt className="sr-only">{metric.label}</dt>
                      <dd className="contents">
                        <MetricValue
                          value={metric.value}
                          className="text-chalk-100 w-20 shrink-0 text-2xl font-medium"
                        />
                        <span aria-hidden="true" className="text-sm">
                          {metric.label}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div>
              <h3 className="label">Built with</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <li key={item} className="border-ink-600 rounded-full border px-3 py-1 text-xs">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <ul className="space-y-2">
              {project.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-chalk-100 hover:text-white inline-flex items-center gap-1.5 underline decoration-ink-600 underline-offset-4 hover:decoration-chalk-300"
                  >
                    {link.label}
                    <ArrowOut />
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </article>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="label">{title}</h3>
      <p className="mt-3 leading-relaxed">{children}</p>
    </section>
  );
}

/**
 * One screen at a time, with a rail of the rest underneath.
 *
 * Nothing is cropped to fit: phone screenshots and a 16:9 tour share one
 * stage, letterboxed against the dark. A clip downloads nothing until someone
 * presses play — `preload="none"` with its poster — so a tour nobody watches
 * costs the page nothing.
 */
function Gallery({
  media,
  startAt,
  name,
}: {
  media: ProjectMedia[];
  startAt: number;
  name: string;
}) {
  const [index, setIndex] = useState(Math.min(Math.max(startAt, 0), media.length - 1));
  const current = media[index];

  return (
    <div className="mt-10">
      <div className="border-ink-700 bg-ink-900 relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl border">
        {current.kind === 'video' ? (
          <video
            key={current.src}
            src={current.src}
            poster={current.poster}
            controls
            playsInline
            preload="none"
            aria-label={`${name}: ${current.caption}`}
            className="h-full w-full object-contain"
          />
        ) : (
          <img
            key={current.src}
            src={current.src}
            alt={`${name}: ${current.caption}`}
            decoding="async"
            className="h-full w-full object-contain p-3 sm:p-6"
          />
        )}
      </div>
      <p className="text-chalk-500 mt-3 text-sm" aria-live="polite">
        {current.caption}
        <span className="tabular-nums">
          {' '}
          — {index + 1} of {media.length}
        </span>
      </p>

      {media.length > 1 && (
        <ul aria-label="Screens" className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {media.map((item, i) => (
            <li key={item.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-current={i === index}
                aria-label={item.caption}
                className={`bg-ink-900 relative block h-16 w-24 overflow-hidden rounded-lg border transition-colors sm:h-20 sm:w-32 ${
                  i === index ? 'border-chalk-100' : 'border-ink-700 hover:border-chalk-500'
                }`}
              >
                <img
                  src={item.kind === 'video' ? item.poster : item.src}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
                {item.kind === 'video' && (
                  <span className="bg-ink-950/80 text-chalk-100 absolute bottom-1 left-1 rounded px-1.5 py-0.5 text-[10px]">
                    ▶ Video
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
