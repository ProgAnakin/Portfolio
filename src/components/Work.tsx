import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { natureLabel, projects, type Project } from '../data/projects';
import { ArrowRight, Section } from './ui';

export type OpenProject = (project: Project, startAt?: number) => void;

const motionQuery = '(prefers-reduced-motion: reduce)';

/**
 * A short silent loop of the product in use.
 *
 * It downloads nothing until the card is near the screen, plays only while it
 * is on screen, and never plays at all for someone who has asked for reduced
 * motion: they get the still. Each loop is 40 to 170 KB.
 */
function Preview({ project, paused }: { project: Project; paused: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const preview = project.preview!;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (paused) {
      video.pause();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [paused]);

  return (
    <video
      ref={ref}
      poster={preview.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      // Not a target of its own: a click on the panel belongs to the button
      // around it, which is what focus should return to when the case closes.
      className={`pointer-events-none h-full w-full ${preview.fit === 'cover' ? 'object-cover object-top' : 'object-contain'}`}
    >
      <source src={preview.video[0]} type="video/mp4" />
      <source src={preview.video[1]} type="video/webm" />
    </video>
  );
}

/** Kouci has no screens to show yet, so its panel shows the mark and the pilot. */
function MarkPanel({ project }: { project: Project }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
      <img src={project.logo} alt="" width={112} height={112} className="size-28 object-contain" />
      <p className="text-snow text-sm font-semibold">Open the {project.name} case</p>
      <p className="text-snow-2 max-w-[26ch] text-sm">
        Pilot club: Vitória Sport Clube, Guimarães. Water polo.
      </p>
    </div>
  );
}

function Card({
  project,
  index,
  layout,
  onOpen,
  paused,
}: {
  project: Project;
  index: number;
  /** `wide` spans the grid; `lead` is wide with the bigger media panel. */
  layout: 'lead' | 'wide' | 'half';
  onOpen: OpenProject;
  paused: boolean;
}) {
  const openCase = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onOpen(project);
  };
  const wide = layout !== 'half';
  const media =
    layout === 'lead'
      ? 'aspect-[4/3] lg:col-span-7 lg:aspect-auto lg:min-h-[440px]'
      : layout === 'wide'
        ? 'aspect-[4/3] lg:col-span-5 lg:aspect-auto lg:min-h-[340px]'
        : 'aspect-[4/3]';
  const text = layout === 'lead' ? 'lg:col-span-5' : layout === 'wide' ? 'lg:col-span-7' : '';

  return (
    <article
      aria-labelledby={`${project.id}-name`}
      className={`group bg-paper border-line flex flex-col overflow-hidden border transition-shadow hover:shadow-lg ${
        wide ? 'md:col-span-2 lg:grid lg:grid-cols-12' : ''
      }`}
    >
      <a
        href={`#case/${project.id}`}
        data-case-id={project.id}
        onClick={openCase}
        aria-label={project.preview ? `Open the ${project.name} case` : undefined}
        className={`bg-night relative block overflow-hidden ${media}`}
        style={{ background: project.preview?.background }}
      >
        {project.preview ? <Preview project={project} paused={paused} /> : <MarkPanel project={project} />}
      </a>

      <div className={`flex flex-1 flex-col p-6 sm:p-8 ${text}`}>
        <div className="text-ink-3 flex items-center justify-between gap-4 text-sm">
          <span>
            {natureLabel[project.nature]}, {project.year}
          </span>
          <span className="tabular-nums">{String(index).padStart(2, '0')}</span>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <img
            src={project.logo}
            alt=""
            width={36}
            height={36}
            className="size-9 shrink-0 rounded-[22%] object-contain"
          />
          <h3 id={`${project.id}-name`} className="head text-ink text-[1.75rem] sm:text-[2rem]">
            {project.name}
          </h3>
        </div>
        <p className="text-ink mt-3 font-medium">{project.tagline}</p>
        <p className="mt-3">{project.summary}</p>

        <p className="text-ink-2 border-line mt-6 border-t pt-4 text-sm">{project.status}</p>

        <div className="mt-auto pt-8">
          <a
            href={`#case/${project.id}`}
            onClick={openCase}
            className="text-ink inline-flex items-center gap-2 border-b border-current pb-0.5 text-[0.9375rem] font-medium"
          >
            Open the case
            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function Work({ onOpen, caseOpen }: { onOpen: OpenProject; caseOpen: boolean }) {
  const [previewsPaused, setPreviewsPaused] = useState(false);
  const [motionReduced, setMotionReduced] = useState(() => window.matchMedia(motionQuery).matches);
  useEffect(() => {
    const preference = window.matchMedia(motionQuery);
    const update = () => setMotionReduced(preference.matches);
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  return (
    <Section id="work" name="Work" note={`${projects.length} projects, built outside work`}>
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
        <h3 className="head text-ink max-w-[18ch] text-[clamp(2.25rem,4.4vw,3.5rem)]">
          Built from the shop floor.
        </h3>
        <p className="max-w-[52ch] lg:self-end">
          A CRM for the counter. A guide to the right product. A place to practise a sales call.
          And a sports start-up I co-founded. Explore the decisions behind each project.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-ink-3 text-sm">Product walkthroughs use demo data.</p>

      {!motionReduced && (
        <button
          type="button"
          onClick={() => setPreviewsPaused((paused) => !paused)}
          className="text-ink border-b border-current pb-0.5 text-sm"
        >
          {previewsPaused ? 'Play previews' : 'Pause previews'}
        </button>
      )}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <Card
            key={project.id}
            project={project}
            index={i + 1}
            layout={i === 0 ? 'lead' : i === projects.length - 1 && i % 2 === 1 ? 'wide' : 'half'}
            onOpen={onOpen}
            paused={previewsPaused || motionReduced || caseOpen}
          />
        ))}
      </div>
    </Section>
  );
}
