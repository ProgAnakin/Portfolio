import { contacts, profile } from '../data/profile';
import { ArrowOut, Container } from './ui';

const NAV = [
  { href: '#record', label: 'Record' },
  { href: '#work', label: 'Work' },
  { href: '#method', label: 'Method' },
  { href: '#contact', label: 'Contact' },
];

const linkedin = contacts.find((contact) => contact.id === 'linkedin');

export function SiteHeader() {
  return (
    <header className="bg-night/95 border-night-line sticky top-0 z-40 border-b backdrop-blur">
      <Container className="flex h-14 items-center justify-between gap-6">
        <a href="#top" className="wide text-snow text-[0.8125rem] font-semibold">
          {profile.name}
        </a>
        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-snow-2 hover:text-snow text-sm transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {linkedin?.href && (
          <a
            href={linkedin.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-snow inline-flex items-center gap-1.5 text-sm"
          >
            LinkedIn
            <ArrowOut />
          </a>
        )}
      </Container>
    </header>
  );
}
