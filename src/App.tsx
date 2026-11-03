import { useEffect, useRef, useState } from 'react';
import { Contact, Method, SiteFooter } from './components/Contact';
import { Hero } from './components/Hero';
import { ProjectDialog } from './components/ProjectDialog';
import { Record } from './components/Record';
import { SiteHeader } from './components/SiteHeader';
import { Work } from './components/Work';
import { projects, type Project } from './data/projects';

function caseFromLocation() {
  const project = projects.find((item) => window.location.hash === `#case/${item.id}`);
  return project ? { project, startAt: 0 } : null;
}

export default function App() {
  const [open, setOpen] = useState(caseFromLocation);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open || !opener.current) return;
    // History can move focus to a section anchor after the dialog closes.
    const frame = requestAnimationFrame(() => opener.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    const sync = () => setOpen(caseFromLocation());
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  const openCase = (project: Project, startAt = 0) => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    window.history.pushState({ ...window.history.state, portfolioCase: true }, '', `#case/${project.id}`);
    setOpen({ project, startAt });
  };

  const closeCase = () => {
    const current = caseFromLocation();
    if (!current) return;
    if (window.history.state?.portfolioCase) {
      window.history.back();
    } else {
      // A shared URL has no in-app opener to return to.
      window.history.replaceState(window.history.state, '', '#work');
      opener.current = document.querySelector<HTMLAnchorElement>(`[data-case-id="${current.project.id}"]`);
      setOpen(null);
    }
  };

  return (
    <>
      <a
        href="#work"
        className="bg-snow text-ink sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to the work
      </a>
      <SiteHeader />
      <main>
        <Hero />
        <Record />
        {/* A case opens on its video, the demo being the point of the case. */}
        <Work onOpen={openCase} />
        <Method />
        <Contact />
      </main>
      <SiteFooter />
      <ProjectDialog
        project={open?.project ?? null}
        startAt={open?.startAt ?? 0}
        onClose={closeCase}
      />
    </>
  );
}
