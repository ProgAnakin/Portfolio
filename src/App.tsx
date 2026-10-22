import { useState } from 'react';
import { Contact, Method, SiteFooter } from './components/Contact';
import { Hero } from './components/Hero';
import { ProjectDialog } from './components/ProjectDialog';
import { Record } from './components/Record';
import { SiteHeader } from './components/SiteHeader';
import { Work } from './components/Work';
import type { Project } from './data/projects';

export default function App() {
  const [open, setOpen] = useState<{ project: Project; startAt: number } | null>(null);

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
        <Work onOpen={(project, startAt = 0) => setOpen({ project, startAt })} />
        <Method />
        <Contact />
      </main>
      <SiteFooter />
      <ProjectDialog
        project={open?.project ?? null}
        startAt={open?.startAt ?? 0}
        onClose={() => setOpen(null)}
      />
    </>
  );
}
