import { contacts, profile } from "../data/profile";
import { natureShort, projects, shelfSummary } from "../data/projects";
import { mediaFor } from "../data/media";
import { ProjectDetail } from "./ProjectDetail";
import { BlurFade } from "./magicui/blur-fade";
import { GridPattern } from "./magicui/grid-pattern";
import { ProjectCover } from "./ProjectCover";
import { ProjectMedia } from "./ProjectMedia";

/**
 * The same shelf, laid out flat.
 *
 * The room is the argument — a salesperson's portfolio built as a shop floor —
 * but a room is a thing you have to agree to explore, and a recruiter with
 * forty tabs open has not agreed to anything. So the page breaks in two: the
 * shop keeps the first screen, whole and undisturbed, and everything in it is
 * written out again below in the order a CV would have it. Scroll and you get
 * the conventional site; stay and you get the shop. Neither is the other one
 * degraded.
 *
 * Every card is `ProjectDetail`, the same markup the product sheet hands over
 * in the room, so the two can never end up saying different things. What the
 * casebook adds is the part a shelf cannot hold: screenshots and clips of the
 * work actually running.
 */
export function Casebook({ onPrintReceipt }: { onPrintReceipt: () => void }) {
  const linkable = contacts.filter((contact) => contact.href);

  return (
    <section
      id="casebook"
      aria-labelledby="casebook-heading"
      className="bg-ink-800 border-ink-500/60 relative border-t"
    >
      {/* Graph paper, barely. The room upstairs is a drawn place with a lot in
          it; this is a page, and a page of type on flat ink reads as a
          document that has been left somewhere. Masked out towards the edges
          so it is a texture rather than a grid someone forgot to remove. */}
      <GridPattern
        width={46}
        height={46}
        strokeDasharray="3 5"
        className="stroke-paper-500/[0.09] [mask-image:radial-gradient(70%_55%_at_50%_30%,black,transparent)]"
      />

      {/* A seam, not a hard edge: the room above fades into the page rather
          than stopping at a line. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 to-transparent"
      />

      <div className="relative mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        <BlurFade inView className="max-w-2xl">
          <header>
            <p className="font-till text-accent text-[0.58rem] tracking-[0.22em] uppercase">
              The whole shelf, in writing
            </p>
            <h2
              id="casebook-heading"
              className="font-sign text-paper-100 mt-3 text-4xl sm:text-5xl"
            >
              The work
            </h2>
            <div aria-hidden="true" className="bg-accent mt-4 h-[3px] w-24" />

            <p className="text-paper-300 mt-6 leading-relaxed">
              I sell for a living, so the portfolio is a shop. Every project up
              there is a product on a shelf — pick it up, turn it over, read the
              tag, take a receipt on the way out. It is built the way I would
              want a shop floor built: the thing does the explaining, not a
              paragraph about the thing.
            </p>
            <p className="text-paper-500 mt-4 leading-relaxed">
              This is the same inventory laid out flat, for anyone who would
              rather read than explore. Same projects, same figures, same links
              — and the screenshots a shelf cannot hold. {shelfSummary()} Each
              one says which it is, because a company and something I built for
              free on a Sunday are not the same claim.
            </p>
            {/* A way past the reading. Somebody who came for one project — the
              SaaS, usually — should not have to scroll three cards to find it,
              and the row doubles as a contents page for the section. */}
            <nav aria-label="The projects" className="mt-8">
              <ul className="flex flex-wrap gap-2">
                {projects.map((project) => (
                  <li key={project.id}>
                    <a
                      href={`#case-${project.id}`}
                      className="font-till border-ink-500 text-paper-300 hover:border-paper-500 hover:text-paper-100 group flex items-center gap-2 border px-3 py-2 text-[0.58rem] tracking-[0.12em] transition-colors"
                    >
                      <span
                        aria-hidden="true"
                        className="size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: project.brand.accent }}
                      />
                      {project.name}
                      <span className="text-paper-500 text-[0.5rem] tracking-[0.16em]">
                        {natureShort[project.nature]}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </header>
        </BlurFade>

        <ol className="mt-14 space-y-14 sm:mt-20 sm:space-y-20">
          {projects.map((project) => {
            const media = mediaFor(project.id);

            return (
              <li
                key={project.id}
                id={`case-${project.id}`}
                className="scroll-mt-6"
              >
                <BlurFade inView inViewMargin="-80px">
                  <article className="bg-ink-700 border-ink-500 overflow-hidden border shadow-[0_18px_50px_rgba(6,5,4,0.5)]">
                    <ProjectCover project={project} />
                    <ProjectDetail project={project} as="h3">
                      {media.length > 0 && (
                        <ProjectMedia project={project} media={media} />
                      )}
                    </ProjectDetail>
                  </article>
                </BlurFade>
              </li>
            );
          })}
        </ol>

        {/* The way out, for anyone who read this far and never touched the
            telephone in the room. */}
        <footer className="border-ink-500 mt-16 border-t pt-10 sm:mt-24">
          <h3 className="font-sign text-paper-100 text-2xl sm:text-3xl">
            What I am after
          </h3>
          <p className="text-paper-300 mt-3 max-w-2xl leading-relaxed">
            {profile.openTo.roles.join(", ")} roles in{" "}
            {profile.openTo.markets.join(", ")}. {profile.languages.join(" · ")}
            .
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            {linkable.map((contact, index) => (
              <a
                key={contact.id}
                href={contact.href}
                target="_blank"
                rel="noreferrer"
                className={`font-till group inline-flex items-center gap-2 px-4 py-3 text-[0.62rem] tracking-[0.14em] uppercase transition-transform hover:-translate-y-0.5 ${
                  index === 0
                    ? "bg-accent text-ink-900"
                    : "border-paper-500/50 text-paper-300 border"
                }`}
              >
                {contact.label}
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  ↗
                </span>
              </a>
            ))}

            <button
              type="button"
              onClick={onPrintReceipt}
              className="font-till border-paper-500/50 text-paper-300 hover:border-accent hover:text-accent cursor-pointer border px-4 py-3 text-[0.62rem] tracking-[0.14em] uppercase transition-colors"
            >
              Print a receipt
            </button>
          </div>

          <p className="font-till text-paper-500 mt-6 text-[0.56rem] tracking-[0.14em] uppercase">
            {contacts.find((contact) => contact.id === "email")?.label}:{" "}
            {contacts.find((contact) => contact.id === "email")?.value}
          </p>
        </footer>
      </div>
    </section>
  );
}
