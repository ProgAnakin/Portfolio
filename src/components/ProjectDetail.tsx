import { BrandMark } from './BrandMark';
import { natureLabel, natureNote, statusLabel, type Project } from '../data/projects';

const STATUS_NOTE: Record<Project['status'], string> = {
  'in-stock': 'Shipped and running',
  'out-of-stock': 'Being built — not shipped yet',
  restocking: 'Coming to the shelf',
};

/**
 * Everything there is to say about one project.
 *
 * Built out of the project's own brand rather than the shop's palette: the
 * header takes its colour, its mark and its paper, so Suaipe and Kouci read as
 * two different products instead of two rows of the same table. The links are
 * the point of it, so they are the loudest thing on it.
 *
 * It lives on its own because it is shown twice — handed over as a sheet when
 * you pick a product off the shelf, and laid out flat in the casebook for
 * anyone who would rather scroll than explore. Two copies of this markup would
 * disagree within a week, and the page would be telling a recruiter two
 * slightly different things about the same work.
 */
export function ProjectDetail({
  project,
  as: Heading = 'h2',
  headingId,
  children,
}: {
  project: Project;
  /** `h2` in the modal, `h3` under the casebook's own heading. */
  as?: 'h2' | 'h3';
  headingId?: string;
  /**
   * The media strip, when there is any. It sits under the description —
   * what the thing is, then what it looks like — and it is a slot rather
   * than a field because the product sheet in the room does not take one:
   * a viewer opening out of a modal is a modal on a modal.
   */
  children?: React.ReactNode;
}) {
  const { brand } = project;
  const soldOut = project.status !== 'in-stock';

  return (
    <>
      {/* Header, in the project's own colours. */}
      <header
        className="relative px-6 pt-6 pb-5 sm:px-8"
        style={{ backgroundColor: brand.base, color: brand.paper }}
      >
        <div className="flex items-start gap-4">
          <span
            className="flex size-16 shrink-0 items-center justify-center rounded-sm sm:size-20"
            style={{ backgroundColor: brand.ink }}
          >
            <BrandMark brand={brand} size={56} />
          </span>

          <div className="min-w-0 pt-0.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <p
                className="font-till inline-flex items-center gap-1.5 px-2 py-1 text-[0.56rem] tracking-[0.18em] uppercase"
                style={{
                  backgroundColor: soldOut ? brand.paper : brand.accent,
                  color: brand.ink,
                }}
              >
                <span aria-hidden="true">{soldOut ? '◷' : '●'}</span>
                {statusLabel[project.status]}
              </p>
              {/* Second chip, outlined rather than filled: it qualifies the
                  first one instead of competing with it. */}
              <p
                className="font-till inline-flex items-center px-2 py-1 text-[0.56rem] tracking-[0.18em] uppercase"
                style={{ border: `1px solid ${brand.paper}`, color: brand.paper, opacity: 0.85 }}
              >
                {natureLabel[project.nature]}
              </p>
            </div>
            <Heading id={headingId} className="font-sign mt-2 text-3xl sm:text-[2.6rem]">
              {project.name}
            </Heading>
            <p className="mt-0.5 text-sm opacity-80">{project.tagline}</p>
          </div>
        </div>

        <p className="font-till mt-4 text-[0.58rem] tracking-[0.14em] uppercase opacity-70">
          {STATUS_NOTE[project.status]} · {project.tag.kind} · {project.tag.year}
        </p>
        <p className="mt-1.5 text-[0.82rem] leading-snug opacity-75">
          {natureNote[project.nature]}
        </p>
      </header>

      <div className="space-y-6 py-6">
        <p className="text-paper-300 px-6 leading-relaxed sm:px-8">{project.description}</p>

        {children}

        {/* A list rather than a <dl>: the figure is read before its label,
            and a <dl> that puts its <dd> first is not a <dl>. */}
        {project.metrics && project.metrics.length > 0 && (
          <ul className="border-ink-500 mx-6 flex flex-wrap gap-x-9 gap-y-4 border-y py-4 sm:mx-8">
            {project.metrics.map((metric) => (
              <li key={metric.label} className="max-w-[13rem] min-w-[5.5rem]">
                <span
                  className="block text-[1.7rem] leading-none font-semibold"
                  style={{ color: brand.accent }}
                >
                  {metric.value}
                </span>
                <span className="font-till text-paper-500 mt-1.5 block text-[0.54rem] tracking-[0.18em] uppercase">
                  {metric.label}
                </span>
                {metric.note && (
                  <span className="text-paper-500/70 mt-1 block text-[0.72rem] leading-snug">
                    {metric.note}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="grid gap-5 px-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:px-8">
          <div>
            <h4 className="font-till text-paper-500 text-[0.56rem] tracking-[0.2em] uppercase">
              My role
            </h4>
            <p className="text-paper-300 mt-1.5 text-[0.92rem] leading-relaxed">{project.role}</p>
          </div>

          <div>
            <h4 className="font-till text-paper-500 text-[0.56rem] tracking-[0.2em] uppercase">
              Built with
            </h4>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {project.stack.map((item) => (
                <li
                  key={item}
                  className="font-till border-ink-500 text-paper-300 border px-2 py-1 text-[0.6rem] tracking-[0.06em]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The links are what this is for. */}
        <div className="px-6 sm:px-8">
          <h4 className="font-till text-paper-500 text-[0.56rem] tracking-[0.2em] uppercase">
            {project.links.length > 0 ? 'Go and look' : 'Nothing to show yet'}
          </h4>
          {project.links.length > 0 ? (
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {project.links.map((link, index) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-till group inline-flex items-center gap-2 px-3.5 py-2.5 text-[0.62rem] tracking-[0.14em] uppercase transition-transform hover:-translate-y-0.5"
                    style={
                      index === 0
                        ? { backgroundColor: brand.accent, color: brand.ink }
                        : { border: `1px solid ${brand.accent}`, color: brand.accent }
                    }
                  >
                    {link.label}
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-paper-500 mt-1.5 text-[0.92rem]">
              It is still in the back room. The receipt has my contacts if you want to hear how it
              is going.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
