import { contacts, figures, profile } from '../data/profile';
import { ArrowOut, Container, button } from './ui';

const linkedin = contacts.find((contact) => contact.id === 'linkedin');

/** The black cover: who, what, and the four numbers that back it up. */
export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-name" className="bg-night text-snow-2">
      <Container className="pt-14 pb-10 sm:pt-24 sm:pb-14">
        <dl className="border-night-line grid gap-x-8 gap-y-4 border-t pt-5 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-snow-3">Now</dt>
            <dd className="text-snow mt-1">
              {profile.role}, {profile.employer}
            </dd>
          </div>
          <div>
            <dt className="text-snow-3">Languages</dt>
            <dd className="text-snow mt-1">
              {profile.languages.map((language) => language.name).join(', ')}
            </dd>
          </div>
          <div>
            <dt className="text-snow-3">Open to</dt>
            <dd className="text-snow mt-1">{profile.openTo}</dd>
          </div>
        </dl>

        <h1
          id="hero-name"
          className="wide text-snow mt-16 text-[clamp(2.35rem,11.4vw,8.25rem)] leading-[0.9] font-[780] sm:mt-24"
        >
          {/* The space is for anything that reads the text rather than the
              layout: without it the name is one word. */}
          Costanzo <br />
          Annichini
        </h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-x-8">
          <p className="text-snow text-xl leading-[1.45] sm:text-2xl lg:col-span-8">
            {profile.lead}
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4 lg:col-span-4 lg:justify-end lg:self-end">
            {linkedin?.href && (
              <a
                href={linkedin.href}
                target="_blank"
                rel="noopener noreferrer"
                className={button.light}
              >
                Message me on LinkedIn
                <ArrowOut />
              </a>
            )}
            <a href="#work" className={`${button.link} text-snow`}>
              See the work
            </a>
          </div>
        </div>

        <ul
          aria-label="In numbers"
          className="border-night-line mt-16 grid grid-cols-2 border-t sm:mt-20 lg:grid-cols-4"
        >
          {figures.map((figure, i) => (
            <li
              key={figure.label}
              className={`border-night-line py-6 ${i % 2 ? 'border-l pl-5' : 'pr-5'} ${
                i > 1 ? 'border-t lg:border-t-0' : ''
              } ${i === 2 ? 'lg:border-l lg:pl-5' : ''}`}
            >
              <p className="figure text-snow text-[2.5rem] sm:text-6xl">{figure.value}</p>
              <p className="mt-3 text-sm leading-snug">{figure.label}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
