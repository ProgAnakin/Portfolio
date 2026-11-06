import { contacts, figures, profile } from '../data/profile';
import { ArrowOut, ArrowRight, Container, button } from './ui';

const linkedin = contacts.find((contact) => contact.id === 'linkedin');

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-name" className="hero-surface">
      <Container className="pt-12 pb-8 sm:pt-20 sm:pb-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div className="min-w-0">
            <p className="eyebrow flex items-center gap-3">
              <span className="bg-ink h-px w-8" aria-hidden="true" />
              Sales experience. Builder’s mindset.
            </p>
            <h1 id="hero-name" className="text-ink mt-7 text-[clamp(3.2rem,7.1vw,6rem)] leading-[0.95] font-[720] tracking-[-0.065em]">
              Costanzo <br />Annichini<span className="text-accent-dark">.</span>
            </h1>
            <p className="text-ink mt-7 max-w-[30ch] text-xl leading-snug sm:text-2xl">
              I sell technology.<br />And build tools for people who sell.
            </p>
            <p className="mt-5 max-w-[49ch] text-base">
              From conversations at the shop counter to software that supports the next sale.
              Hands-on retail experience, translated into products.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <a href="#work" className={button.dark}>Explore my work <ArrowRight /></a>
              {linkedin?.href && (
                <a href={linkedin.href} target="_blank" rel="noopener noreferrer" className={`${button.link} text-ink`}>
                  Let’s talk <ArrowOut />
                </a>
              )}
            </div>
          </div>
          <aside aria-label="Commercial experience at a glance" className="proof-panel bg-night text-snow p-7 sm:p-9">
            <div className="border-night-line flex items-center justify-between gap-4 border-b pb-5">
              <p className="eyebrow text-snow-2">On the shop floor</p>
              <span className="bg-accent text-ink px-2.5 py-1 text-xs font-semibold">Webidoo Store</span>
            </div>
            <p className="figure mt-9 text-[clamp(3.4rem,7vw,5.5rem)]">{figures[0].value}<span className="text-accent">+</span></p>
            <p className="text-snow-2 mt-3 text-sm">{figures[0].label} · from my sales records</p>
            <dl className="border-night-line mt-8 grid grid-cols-2 gap-5 border-y py-6">
              {figures.slice(1, 3).map((figure) => (
                <div key={figure.label}>
                  <dt className="text-snow-2 text-sm">{figure.label}</dt>
                  <dd className="figure mt-2 text-3xl sm:text-4xl">{figure.value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-snow-2 mt-6 text-sm">A growing responsibility</p>
            <p className="mt-2 text-lg font-medium">20h → 30h → Permanent contract</p>
            <a href="#record" className="text-accent mt-7 inline-flex items-center gap-3 text-sm font-medium">
              Explore the sales record <ArrowRight />
            </a>
          </aside>
        </div>
        <dl className="border-line mt-12 grid gap-6 border-t pt-6 text-sm sm:mt-16 sm:grid-cols-3 sm:gap-8">
          <div><dt className="eyebrow text-ink-3">Currently</dt><dd className="text-ink mt-2">{profile.role} · {profile.employer}</dd></div>
          <div><dt className="eyebrow text-ink-3">Three languages</dt><dd className="text-ink mt-2">{profile.languages.map((language) => language.name).join(' · ')}</dd></div>
          <div><dt className="eyebrow text-ink-3">Next chapter</dt><dd className="text-ink mt-2">{profile.openTo}</dd></div>
        </dl>
      </Container>
    </section>
  );
}
