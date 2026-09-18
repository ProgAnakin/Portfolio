import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';
import { projects } from '../data/projects';
import { Lighting } from './Lighting';
import { ProductObject } from './ProductObject';
import { Counter3D } from './Counter3D';
import { HotspotProjector } from './HotspotProjector';
import { ShelfDressing } from './ShelfDressing';
import { WallSign } from './WallSign';
import { Floor, placement, SHELF_X, SHELF_Y, ShelfRig } from './ShelfRig';
import { palette } from './tokens';
import type { SceneTier } from './useSceneQuality';

/** Everything that has to stay in shot, in world units. */
const ROOM = { width: 8.8, height: 4.1, centreX: 0.05, centreY: 1.58 };

/**
 * The camera leans with the cursor, and always frames the whole room.
 *
 * A perspective camera's `fov` is vertical, so a narrow window silently crops
 * the sides — which is how the till ends up off-screen on a laptop in a split
 * view. The distance is solved from the aspect every resize instead of being
 * a constant that happens to look right at one size.
 */
function CameraRig({ enabled }: { enabled: boolean }) {
  const { camera, size } = useThree();
  const target = useRef({ x: 0, y: 0 });
  const distance = useRef(7);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (event: PointerEvent) => {
      target.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled]);

  useEffect(() => {
    const perspective = camera as typeof camera & { fov: number; aspect: number };
    const vFov = (perspective.fov * Math.PI) / 180;
    const aspect = size.width / size.height;
    const forHeight = ROOM.height / 2 / Math.tan(vFov / 2);
    const forWidth = ROOM.width / 2 / (Math.tan(vFov / 2) * aspect);
    distance.current = Math.max(forHeight, forWidth) + 0.6;
  }, [camera, size]);

  useFrame((_, dt) => {
    const k = Math.min(1, dt * 2.2);
    camera.position.x += (ROOM.centreX + target.current.x * 0.42 - camera.position.x) * k;
    camera.position.y += (ROOM.centreY + 0.14 - target.current.y * 0.22 - camera.position.y) * k;
    camera.position.z += (distance.current - camera.position.z) * k;
    camera.lookAt(ROOM.centreX, ROOM.centreY, 0);
  });

  return null;
}

export default function ShopCanvas({ tier }: { tier: SceneTier }) {
  const [awake, setAwake] = useState(true);

  // Stop rendering when the tab is in the background. A shop nobody is
  // looking at does not need to draw itself sixty times a second.
  useEffect(() => {
    const onVisibility = () => setAwake(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return (
    <Canvas
      aria-hidden="true"
      frameloop={awake ? 'always' : 'never'}
      dpr={tier === 'full' ? [1, 1.75] : [1, 1.25]}
      // Transparent, so the oversized type sitting behind the canvas shows
      // through everywhere the room is empty — and is cropped by the shelves.
      gl={{ antialias: tier === 'full', alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0.3, 1.72, 6.9], fov: 40 }}
      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <fog attach="fog" args={[palette.ink900(), 8, 19]} />

      <CameraRig enabled={tier === 'full'} />
      <Lighting shelfY={SHELF_Y} shelfX={SHELF_X} />
      <WallSign />
      <ShelfRig />
      <ShelfDressing />
      <Counter3D />
      <Floor />

      {projects.map((project) => (
        <ProductObject
          key={project.id}
          project={project}
          position={placement(project.shelf, project.slot)}
        />
      ))}

      <HotspotProjector />
    </Canvas>
  );
}
