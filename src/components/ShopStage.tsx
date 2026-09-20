import { Suspense, lazy, useMemo } from 'react';
import { ShopScene } from './shop/ShopScene';
import { useSceneQuality } from '../three/useSceneQuality';
import { useShop } from '../state/ShopContext';
import { StageOverlay } from './StageOverlay';
import { HotspotLayer, type Hotspot } from './HotspotLayer';
import { ContactsCard } from './ContactsCard';
import { ShelfTalker } from './ShelfTalker';
import { SceneBoundary } from './SceneBoundary';
import { projects, statusLabel } from '../data/projects';
import { productHitSize, productLimits } from '../three/shapeMetrics';

const ShopCanvas = lazy(() => import('../three/ShopCanvas'));

/**
 * Decides which shop you get.
 *
 * The room is an enhancement and the drawing is not a consolation prize: on a
 * phone, on a tablet, on a metered connection, with reduced motion, or without
 * WebGL, the illustrated shop is the whole site and it is complete. Neither
 * version is the other one degraded — they are two readings of the same place.
 */
export function ShopStage({ onPrintReceipt }: { onPrintReceipt: () => void }) {
  const tier = useSceneQuality();
  const { open } = useShop();

  const hotspots = useMemo<Hotspot[]>(
    () => [
      ...projects.map((project) => ({
        id: project.id,
        label: `${project.name} — ${project.tagline}. ${statusLabel[project.status]}. Open details, or drag it off the shelf.`,
        size: productHitSize(project),
        onActivate: () => open(project.id),
        drag: productLimits(project),
        popover: <ShelfTalker project={project} />,
      })),
      {
        id: 'telephone',
        label: 'Telephone — show contact details',
        size: [86, 72] as [number, number],
        anchorId: 'contact',
        onActivate: () => {},
        popover: <ContactsCard />,
      },
      {
        id: 'till',
        label: 'Cash register — print a receipt for this visit',
        size: [96, 84] as [number, number],
        onActivate: onPrintReceipt,
      },
    ],
    [open, onPrintReceipt],
  );

  if (tier === 'off') {
    return <ShopScene onPrintReceipt={onPrintReceipt} />;
  }

  return (
    // `#projects` and `#contact` have to resolve in this branch too: the text
    // nav is the escape hatch for anyone who will not explore a room, and a
    // fragment link that lands on nothing is worse than no link.
    //
    // The stage is never taller than the window: a bare `min-h` that exceeds a
    // short viewport pushes everything anchored to the bottom of it — the
    // name, the standfirst — below the fold, on a browser someone has simply
    // dragged short.
    <div
      id="projects"
      tabIndex={-1}
      aria-label="The shop floor"
      className="relative h-[100svh] min-h-[min(38rem,100svh)] w-full overflow-hidden outline-none"
    >
      <SceneBoundary fallback={<ShopScene onPrintReceipt={onPrintReceipt} />}>
        <Suspense fallback={null}>
          <ShopCanvas tier={tier} />
        </Suspense>
        <HotspotLayer hotspots={hotspots} />
        <StageOverlay />
      </SceneBoundary>

      {/* The page below is the whole point of the page below: a room is
          something a visitor has to agree to explore, and nothing on a stage
          exactly one viewport tall says there is more. Only on this branch —
          the drawn shop is a tall scrolling column already, and a "scroll
          down" arrow on a page that is visibly scrolling is noise.

          A real anchor, so it works with a keyboard, without JavaScript, and
          as a link someone can copy. */}
      <a
        href="#casebook"
        className="font-till text-paper-500 hover:text-paper-300 focus-visible:text-paper-300 absolute bottom-4 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-1 text-center text-[0.52rem] tracking-[0.2em] whitespace-nowrap uppercase transition-colors [@media(max-height:600px)]:hidden"
      >
        Screenshots and the write-up
        <span aria-hidden="true" className="animate-bounce text-[0.85rem] leading-none">
          ↓
        </span>
      </a>
    </div>
  );
}
