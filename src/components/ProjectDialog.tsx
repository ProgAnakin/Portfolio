import { useEffect, useRef, useState } from 'react';
import { mediaFor, type ProjectMedia } from '../data/media';
import { natureLabel, type Chapter, type Project } from '../data/projects';
import { ArrowOut } from './ui';

/**
 * A project's case, over the page.
 *
 * The main page stays short and the detail is one click away. A native
 * `<dialog>` opened with `showModal()`: it traps focus, closes on Escape, makes
 * the page behind it inert and hands focus back to whatever opened it.
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
      className="bg-paper text-ink-2 m-auto h-full max-h-none w-full max-w-none overflow-y-auto p-0 sm:h-[min(94vh,1000px)] sm:w-[min(94vw,1160px)]"
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
      {/* The brand's own colour, once: the project has been opened, so it
          gets to be itself. */}
      <div aria-hidden="true" className="h-1.5" style={{ background: project.accent }} />

      <header className="bg-paper/95 border-line sticky top-0 z-10 flex items-center justify-between gap-4 border-b px-5 py-3 backdrop-blur sm:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={project.logo}
            alt=""
            width={28}
            height={28}
            className="size-7 shrink-0 rounded-[22%] object-contain"
          />
          <p className="text-ink truncate text-sm font-semibold">{project.name}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          // Focus lands on the way out, so a keyboard user starts somewhere
          // harmless and a screen reader starts at the top.
          autoFocus
          className="border-ink text-ink hover:bg-ink hover:text-paper border px-4 py-1.5 text-sm font-medium transition-colors"
        >
          Close
        </button>
      </header>

      <div className="px-5 pt-10 pb-16 sm:px-10 sm:pt-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-8">
            <h2 id="case-name" className="head text-ink text-[clamp(2.25rem,5vw,4rem)]">
              {project.name}
            </h2>
            <p className="text-ink mt-3 text-xl">{project.tagline}</p>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 self-end text-sm lg:col-span-4">
            <Fact label="Type" value={natureLabel[project.nature]} />
            <Fact label="Year" value={project.year} />
            <Fact label="Status" value={project.status} wide />
          </dl>
        </div>

        {media.length > 0 && <Player media={media} startAt={startAt} project={project} />}

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="space-y-10 lg:col-span-7">
            <Block title="Why it exists">
              <p>{project.context}</p>
            </Block>
            <Block title={project.steps.title}>
              <ol className="border-line border-t">
                {project.steps.items.map((item, i) => (
                  <li
                    key={item}
                    className="border-line grid grid-cols-[2rem_1fr] gap-2 border-b py-3"
                  >
                    <span className="text-ink-3 text-sm tabular-nums">{i + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </Block>
            <Block title="Where it stands">
              <p>{project.outcome}</p>
            </Block>
          </div>

          <aside className="space-y-10 lg:col-span-5">
            {project.metrics && (
              <Block title="In numbers">
                <dl className="border-line border-t">
                  {project.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="border-line flex items-baseline gap-5 border-b py-4"
                    >
                      <dt className="sr-only">{metric.label}</dt>
                      <dd className="contents">
                        <span className="figure text-ink w-24 shrink-0 text-3xl">
                          {metric.value}
                        </span>
                        <span aria-hidden="true" className="text-sm">
                          {metric.label}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </Block>
            )}
            <Block title="My role">
              <p>{project.role}</p>
            </Block>
            <Block title="Built with">
              <p>{project.stack.join(', ')}</p>
            </Block>
            <ul className="space-y-3">
              {project.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink inline-flex items-center gap-2 border-b border-current pb-0.5 font-medium"
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

function Fact({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? 'col-span-2' : ''}>
      <dt className="text-ink-3">{label}</dt>
      <dd className="text-ink mt-0.5">{value}</dd>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="wide text-ink mb-4 text-[0.75rem] font-semibold">{title}</h3>
      {children}
    </section>
  );
}

const time = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

/**
 * The case's media: one stage, a rail of everything underneath, and for the
 * video a list of chapters that jump to the part of the demo someone wants to
 * see. A clip downloads nothing until it is played (`preload="none"` with its
 * poster); nothing is cropped to fit, phone screens and a 16:9 tour share one
 * stage, letterboxed against black.
 */
function Player({
  media,
  startAt,
  project,
}: {
  media: ProjectMedia[];
  startAt: number;
  project: Project;
}) {
  const [index, setIndex] = useState(Math.min(Math.max(startAt, 0), media.length - 1));
  const [now, setNow] = useState(0);
  const video = useRef<HTMLVideoElement>(null);
  const current = media[index];
  const chapters: Chapter[] =
    current.kind === 'video' && index === 0 ? (project.chapters ?? []) : [];
  const active = chapters.reduce((found, chapter, i) => (now >= chapter.at ? i : found), 0);

  const jump = (at: number) => {
    const node = video.current;
    if (!node) return;
    node.currentTime = at;
    node.play().catch(() => {});
  };

  return (
    <div className="mt-10">
      <div className="bg-night relative flex aspect-video max-h-[70vh] w-full items-center justify-center overflow-hidden">
        {current.kind === 'video' ? (
          <video
            ref={video}
            key={current.src}
            poster={current.poster}
            controls
            muted
            playsInline
            preload="none"
            onTimeUpdate={(event) => setNow(event.currentTarget.currentTime)}
            aria-label={`${project.name}: ${current.caption}`}
            className="h-full w-full object-contain"
          >
            {current.sources?.map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
          </video>
        ) : (
          <img
            key={current.src}
            src={current.src}
            alt={`${project.name}: ${current.caption}`}
            decoding="async"
            className="h-full w-full object-contain p-3 sm:p-6"
          />
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-sm">
        <p className="text-ink" aria-live="polite">
          {current.caption}
        </p>
        {current.kind === 'video' && project.videoNote && (
          <p className="text-ink-3">{project.videoNote}</p>
        )}
      </div>

      {chapters.length > 0 && (
        <ol
          aria-label="Chapters"
          className="border-line mt-5 grid border-t sm:grid-cols-2 lg:grid-cols-4"
        >
          {chapters.map((chapter, i) => (
            <li key={chapter.at} className="border-line border-b">
              <button
                type="button"
                onClick={() => jump(chapter.at)}
                aria-current={i === active && now > 0 ? 'step' : undefined}
                className={`flex w-full items-baseline gap-3 py-3 pr-3 text-left text-sm transition-colors ${
                  i === active && now > 0 ? 'text-ink font-semibold' : 'text-ink-2 hover:text-ink'
                }`}
              >
                <span className="text-ink-3 w-9 shrink-0 font-normal tabular-nums">
                  {time(chapter.at)}
                </span>
                {chapter.label}
              </button>
            </li>
          ))}
        </ol>
      )}

      {media.length > 1 && (
        <ul aria-label="Screens" className="mt-6 flex gap-3 overflow-x-auto pb-2">
          {media.map((item, i) => (
            <li key={item.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-current={i === index}
                aria-label={item.kind === 'video' ? `${item.caption}, video` : item.caption}
                className={`bg-night relative block h-16 w-24 overflow-hidden border-2 transition-colors sm:h-20 sm:w-32 ${
                  i === index ? 'border-ink' : 'border-transparent hover:border-line'
                }`}
              >
                <img
                  src={item.kind === 'video' ? item.poster : item.src}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
                {item.kind === 'video' && (
                  <span className="bg-night text-snow absolute bottom-0 left-0 px-1.5 py-0.5 text-[10px] font-medium">
                    Video
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
