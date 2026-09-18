import { Suspense, lazy, useMemo } from 'react';
import { ShopScene } from './shop/ShopScene';
import { useSceneQuality } from '../three/useSceneQuality';
import { useShop } from '../state/ShopContext';
import { StageOverlay } from './StageOverlay';
import { HotspotLayer, type Hotspot } from './HotspotLayer';
import { ContactsCard } from './ContactsCard';
import { projects, statusLabel } from '../data/projects';
import { productHitSize } from '../three/shapeMetrics';

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
        draggable: true,
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
    <div
      id="projects"
      tabIndex={-1}
      aria-label="The shop floor"
      className="relative h-[100svh] min-h-[38rem] w-full overflow-hidden outline-none"
    >
      <Suspense fallback={null}>
        <ShopCanvas tier={tier} />
      </Suspense>
      <HotspotLayer hotspots={hotspots} />
      <StageOverlay />
    </div>
  );
}
