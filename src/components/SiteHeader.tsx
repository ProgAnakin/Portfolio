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
    <header className="bg-paper/95 border-line sticky top-0 z-40 border-b backdrop-blur">
      <Container className="flex h-14 items-center justify-between gap-6">
        <a href="#top" className="text-ink flex items-center gap-3 text-[0.8125rem] font-semibold">
          <span className="bg-ink text-paper grid size-8 place-items-center text-xs">CA</span>
          <span>{profile.name}</span>
        </a>
        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-ink-3 hover:text-ink text-sm transition-colors"
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
            className="text-ink inline-flex items-center gap-1.5 text-sm"
          >
            LinkedIn
            <ArrowOut />
          </a>
        )}
      </Container>
      <nav aria-label="Sections on mobile" className="border-line border-t md:hidden">
        <Container>
          <ul className="flex justify-between gap-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-ink-3 hover:text-ink block py-3 text-sm">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>
    </header>
  );
}
