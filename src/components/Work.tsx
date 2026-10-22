import { mediaFor } from '../data/media';
import { natureLabel, projects, type Project } from '../data/projects';
import { MetricValue } from './MetricValue';
import { ArrowRight, Reveal, Section, button } from './ui';

export type OpenProject = (project: Project, startAt?: number) => void;

/** A project's mark, grey until the work around it is pointed at. */
function Logo({ project, size }: { project: Project; size: number }) {
  return (
    <img
      src={project.logo}
      alt=""
      width={size}
      height={size}
      className="tint shrink-0 rounded-[22%] object-contain"
      style={{ width: size, height: size }}
    />
  );
}

/**
 * The flagship, given the room. It is the one product here that exists to be
 * sold, and the one a sales recruiter should look at first: a salesperson who
 * wanted a better follow-up tool and built a CRM.
 */
function Featured({ project, onOpen }: { project: Project; onOpen: OpenProject }) {
  const media = mediaFor(project.id);
  const still = media.find((item) => item.kind === 'image');
  const clip = media.findIndex((item) => item.kind === 'video');

  return (
    <article
      aria-labelledby={`${project.id}-name`}
      className="tint-group border-ink-700 bg-ink-900 grid overflow-hidden rounded-3xl border lg:grid-cols-12"
    >
      <div className="flex flex-col p-6 sm:p-10 lg:col-span-5">
        <div className="flex items-center gap-4">
          <Logo project={project} size={48} />
          <div>
            <p className="label">
              {natureLabel[project.nature]} · {project.year}
            </p>
            <p className="text-chalk-300 mt-1 text-xs">{project.status}</p>
          </div>
        </div>
        <h3
          id={`${project.id}-name`}
          className="font-display text-chalk-100 mt-8 text-4xl sm:text-5xl"
        >
          {project.name}
        </h3>
        <p className="text-chalk-100 mt-3 text-lg">{project.tagline}</p>
        <p className="mt-4 leading-relaxed">{project.problem}</p>

        {project.metrics && (
          <dl className="border-ink-700 mt-8 grid grid-cols-3 gap-4 border-t pt-6">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="sr-only">{metric.label}</dt>
                <dd>
                  <MetricValue
                    value={metric.value}
                    className="text-chalk-100 block text-2xl font-medium tracking-tight"
                  />
                  <span
                    aria-hidden="true"
                    className="text-chalk-500 mt-1 block text-xs leading-snug"
                  >
                    {metric.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-8 flex flex-wrap gap-3 lg:mt-auto lg:pt-8">
          <button type="button" className={button.primary} onClick={() => onOpen(project)}>
            Read the case
            <ArrowRight />
          </button>
          {clip >= 0 && (
            <button
              type="button"
              className={button.secondary}
              onClick={() => onOpen(project, clip)}
            >
              Watch the tour
            </button>
          )}
        </div>
      </div>

      {still && (
        <button
          type="button"
          onClick={() => onOpen(project, media.indexOf(still))}
          aria-label={`${project.name}: ${still.caption}. Open the case`}
          className="bg-ink-950/40 relative flex items-center justify-center p-6 sm:p-10 lg:col-span-7"
        >
          <img
            src={still.src}
            alt=""
            loading="lazy"
            decoding="async"
            className="tint w-full max-w-2xl rounded-xl"
          />
        </button>
      )}
    </article>
  );
}

/** Everything else: one line each, opened on demand. */
function Row({ project, index, onOpen }: { project: Project; index: number; onOpen: OpenProject }) {
  return (
    <li className="border-ink-700 border-b">
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="tint-group group hover:bg-ink-900 grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 py-6 text-left transition-colors sm:gap-6 sm:px-4 sm:py-7"
      >
        <Logo project={project} size={44} />
        <span className="min-w-0">
          <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-display text-chalk-100 text-2xl sm:text-3xl">{project.name}</span>
            <span className="text-chalk-300 text-sm">{project.tagline}</span>
          </span>
          <span className="mt-2 flex flex-wrap items-baseline gap-x-2 text-xs">
            <span className="label">{natureLabel[project.nature]}</span>
            <span aria-hidden="true" className="text-chalk-500">
              ·
            </span>
            <span className="text-chalk-500">{project.status}</span>
          </span>
        </span>
        <span className="text-chalk-500 group-hover:text-chalk-100 flex items-center gap-3 text-sm transition-colors">
          <span className="hidden tabular-nums sm:inline">{String(index).padStart(2, '0')}</span>
          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </button>
    </li>
  );
}

export function Work({ onOpen }: { onOpen: OpenProject }) {
  const [flagship, ...rest] = projects;

  return (
    <Section id="work" index="02" name="The work">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-6">
          <h3 className="font-display text-chalk-100 text-4xl leading-[1.05] text-balance sm:text-5xl">
            Built alongside the job.
          </h3>
        </Reveal>
        <Reveal delay={0.08} className="leading-relaxed lg:col-span-5 lg:col-start-8">
          <p>
            I build the tools I wish the shop floor had. One is a product for sale, one is a company
            I co-founded, two were built unpaid to learn — each one says which.
          </p>
        </Reveal>
      </div>

      <Reveal className="mt-14">
        <Featured project={flagship} onOpen={onOpen} />
      </Reveal>

      <Reveal>
        <ul aria-label="More projects" className="border-ink-700 mt-6 border-t">
          {rest.map((project, i) => (
            <Row key={project.id} project={project} index={i + 2} onOpen={onOpen} />
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
