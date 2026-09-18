import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { hotspotFrames, hotspotObjects, projection } from './hotspots';

const world = new Vector3();

/**
 * Projects every registered object to screen coordinates once per frame.
 *
 * One pass for the whole room rather than one per object, and it writes into
 * plain maps rather than React state — the DOM layer picks the values up in
 * its own animation frame.
 */
export function HotspotProjector() {
  const { camera, size } = useThree();

  useFrame(() => {
    const perspective = camera as typeof camera & { fov: number };
    const vFov = (perspective.fov * Math.PI) / 180;

    for (const [id, object] of hotspotObjects) {
      object.getWorldPosition(world);
      const depth = Math.max(0.1, camera.position.distanceTo(world));
      world.project(camera);

      hotspotFrames.set(id, {
        x: (world.x * 0.5 + 0.5) * size.width,
        y: (-world.y * 0.5 + 0.5) * size.height,
        // A thing twice as far away needs half the hit area.
        scale: (size.height / (2 * Math.tan(vFov / 2) * depth)) * 0.01,
        visible: world.z < 1,
      });
    }

    projection.worldPerPixel =
      (2 * Math.abs(camera.position.z) * Math.tan(vFov / 2)) / size.height;
  });

  return null;
}
