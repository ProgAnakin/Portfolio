import { contacts, method, profile } from '../data/profile';
import { ArrowOut, Container, Section } from './ui';

export function Method() {
  return (
    <Section id="method" name="Method" note="How I sell, in the order a sale happens">
      <h3 className="head text-ink mb-10 max-w-[22ch] text-[clamp(2.25rem,4.4vw,3.5rem)]">A conversation first.<br />The right product next.</h3>
      <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {method.map((step, i) => (
          <li
            key={step.title}
            className="border-line border-t pt-6"
          >
            <span className="text-accent-dark figure text-4xl">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="text-ink mt-6 text-lg font-semibold tracking-[-0.01em]">{step.title}</h3>
            <p className="mt-3 text-base">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Contact() {
  return (
    <Section id="contact" name="Contact" tone="night">
      <div className="grid gap-12 lg:grid-cols-9 lg:gap-x-8">
        <div className="lg:col-span-5">
          <h3 className="head text-snow text-[clamp(2.5rem,5.5vw,4.5rem)]">
            Let’s talk about<br /><span className="text-accent">what’s next.</span>
          </h3>
          <p className="mt-6 max-w-[52ch]">
            I’m looking for a sales, SDR or business development role where I can bring hands-on
            selling experience, consistent follow-up and the ability to build tools for the team.
          </p>
          <dl className="mt-10 grid grid-cols-3 gap-6 text-sm">
            {profile.languages.map((language) => (
              <div key={language.name}>
                <dt className="text-snow">{language.name}</dt>
                <dd className="text-snow-3 mt-1">{language.level}</dd>
              </div>
            ))}
          </dl>
        </div>

        <ul className="border-night-line border-t lg:col-span-4">
          {contacts.map((contact) => (
            <li key={contact.id} className="border-night-line border-b">
              {contact.href ? (
                <a
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 py-5"
                >
                  <span className="min-w-0">
                    <span className="text-snow-3 block text-sm">{contact.label}</span>
                    <span className="text-snow mt-1 block truncate">{contact.value}</span>
                  </span>
                  <ArrowOut className="text-snow-3 group-hover:text-snow size-4" />
                </a>
              ) : (
                <div className="py-5">
                  <span className="text-snow-3 block text-sm">{contact.label}</span>
                  <span className="text-snow-2 mt-1 block">{contact.value}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-night text-snow-3">
      <Container>
        <div className="border-night-line flex items-center justify-between gap-4 border-t py-6 text-sm">
          <p>© 2026 {profile.name}</p>
          <a href="#top" className="hover:text-snow">
            Back to top
          </a>
        </div>
      </Container>
    </footer>
  );
}
