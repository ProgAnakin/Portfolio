import { contacts, figures, profile } from '../data/profile';
import { MetricValue } from './MetricValue';
import { ArrowOut, ArrowRight, Container, Reveal, button } from './ui';

const linkedin = contacts.find((contact) => contact.id === 'linkedin');

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-name" className="pt-16 pb-4 sm:pt-28 sm:pb-8">
      <Container>
        <Reveal>
          <p className="label flex flex-wrap gap-x-3 gap-y-1">
            <span className="text-chalk-300">{profile.role}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.employer}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.location}</span>
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <h1
            id="hero-name"
            className="font-display text-chalk-100 mt-6 text-[clamp(3.75rem,15vw,9rem)] leading-[0.9]"
          >
            {/* The space is for anything that reads the text rather than the
                layout: without it the name is one word, "CostanzoAnnichini". */}
            Costanzo <br />
            <span className="text-chalk-300 italic">Annichini</span>
          </h1>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal delay={0.12} className="lg:col-span-7">
            <p className="text-chalk-100 text-xl leading-snug text-balance sm:text-2xl">
              {profile.lead}
            </p>
            <p className="mt-5 max-w-xl leading-relaxed">{profile.standfirst}</p>
          </Reveal>

          <Reveal delay={0.18} className="lg:col-span-4 lg:col-start-9 lg:pt-1.5">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="label">Open to</dt>
                <dd className="text-chalk-100 mt-1.5">{profile.openTo.roles.join(' · ')}</dd>
              </div>
              <div>
                <dt className="label">Where</dt>
                <dd className="text-chalk-100 mt-1.5">{profile.openTo.markets.join(' · ')}</dd>
              </div>
            </dl>
            <div className="mt-7 flex flex-wrap gap-3">
              {linkedin?.href && (
                <a
                  href={linkedin.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={button.primary}
                >
                  LinkedIn
                  <ArrowOut />
                </a>
              )}
              <a href="#work" className={button.secondary}>
                See the work
                <ArrowRight className="rotate-90" />
              </a>
            </div>
          </Reveal>
        </div>

        {/* The headline figures. Text in ink, never in colour; each with the
            fine print that makes it honest sitting right under it. */}
        <Reveal delay={0.24}>
          {/* Hairlines between the tiles come from the gap showing the grid's
              own background through — one rule system at every breakpoint. */}
          <ul
            aria-label="In numbers"
            className="border-ink-700 bg-ink-700 mt-20 grid grid-cols-2 gap-px border-y sm:mt-24 lg:grid-cols-4"
          >
            {figures.map((figure) => (
              <li
                key={figure.label}
                className="bg-ink-950 py-6 pr-4 [&:nth-child(2n)]:pl-5 lg:[&:not(:first-child)]:pl-6"
              >
                <MetricValue
                  value={figure.value}
                  className="text-chalk-100 block text-4xl font-medium tracking-tight sm:text-5xl"
                />
                <p className="text-chalk-100 mt-3 text-sm leading-snug">{figure.label}</p>
                <p className="text-chalk-500 mt-1 text-xs leading-snug">{figure.note}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
