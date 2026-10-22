import { contacts, profile } from '../data/profile';
import { ArrowOut, Container, Reveal, Section } from './ui';

export function Contact() {
  return (
    <Section id="contact" index="04" name="Contact">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-6">
          <h3 className="font-display text-chalk-100 text-5xl leading-none sm:text-7xl">
            Let’s <span className="italic">talk.</span>
          </h3>
          <p className="mt-6 max-w-md leading-relaxed">
            Looking for a sales, SDR or business-development role with a team that sells something
            it believes in — and, one day, a company of my own. LinkedIn is the fastest way to reach
            me.
          </p>
          <dl className="mt-10 grid grid-cols-3 gap-4 text-sm">
            {profile.languages.map((language) => (
              <div key={language.name}>
                <dt className="text-chalk-100">{language.name}</dt>
                <dd className="text-chalk-500 mt-1 text-xs">{language.level}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-5 lg:col-start-8">
          <ul className="border-ink-700 border-t">
            {contacts.map((contact) => (
              <li key={contact.id} className="border-ink-700 border-b">
                {contact.href ? (
                  <a
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 py-5"
                  >
                    <span>
                      <span className="label block">{contact.label}</span>
                      <span className="text-chalk-100 mt-1 block text-lg">{contact.value}</span>
                    </span>
                    <ArrowOut className="text-chalk-500 group-hover:text-chalk-100 size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ) : (
                  <div className="py-5">
                    <span className="label block">{contact.label}</span>
                    <span className="text-chalk-300 mt-1 block text-lg">{contact.value}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-ink-700 border-t py-8">
      <Container className="text-chalk-500 flex flex-col gap-2 text-xs sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>Designed and built by me. No trackers, no cookies, nothing loaded from anyone else.</p>
      </Container>
    </footer>
  );
}
