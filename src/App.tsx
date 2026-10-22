import { useState } from 'react';
import { Approach } from './components/Approach';
import { Contact, SiteFooter } from './components/Contact';
import { Floor } from './components/Floor';
import { Hero } from './components/Hero';
import { ProjectDialog } from './components/ProjectDialog';
import { SiteHeader } from './components/SiteHeader';
import { Work } from './components/Work';
import { mediaFor } from './data/media';
import type { Project } from './data/projects';

/** A case opens on a screen, not on a video waiting to be played. */
const firstStill = (project: Project) =>
  Math.max(
    0,
    mediaFor(project.id).findIndex((item) => item.kind === 'image'),
  );

export default function App() {
  const [open, setOpen] = useState<{ project: Project; startAt: number } | null>(null);

  return (
    <>
      <a
        href="#work"
        className="bg-chalk-100 text-ink-950 sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to the work
      </a>
      <SiteHeader />
      <main>
        <Hero />
        <Floor />
        <Work
          onOpen={(project, startAt) =>
            setOpen({ project, startAt: startAt ?? firstStill(project) })
          }
        />
        <Approach />
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
