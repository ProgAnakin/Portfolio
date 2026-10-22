import { useEffect, useState } from 'react';
import { contacts, profile } from '../data/profile';
import { ArrowOut, Container } from './ui';

const NAV = [
  { href: '#floor', label: 'Record' },
  { href: '#work', label: 'Work' },
  { href: '#approach', label: 'Approach' },
  { href: '#contact', label: 'Contact' },
];

const linkedin = contacts.find((contact) => contact.id === 'linkedin');

export function SiteHeader() {
  // The hairline under the bar appears once there is something under it to
  // separate from; on the first screen it would only be a line across the name.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`bg-ink-950/80 sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-300 ${
        scrolled ? 'border-ink-700' : 'border-transparent'
      }`}
    >
      <Container className="flex h-14 items-center justify-between gap-6">
        <a href="#top" className="text-chalk-100 text-sm font-medium tracking-tight">
          {profile.name}
        </a>
        <nav aria-label="Sections" className="hidden sm:block">
          <ul className="flex items-center gap-7">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-chalk-500 hover:text-chalk-100 text-sm transition-colors"
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
            className="text-chalk-100 hover:text-white inline-flex items-center gap-1.5 text-sm"
          >
            LinkedIn
            <ArrowOut />
          </a>
        )}
      </Container>
    </header>
  );
}
