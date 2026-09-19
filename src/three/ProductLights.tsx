import { projects } from '../data/projects';
import { placement } from './ShelfRig';
import { shapeHeight, PRODUCT_SCALE } from './shapeMetrics';
import { palette } from './tokens';

/**
 * A light per product.
 *
 * Strip lights under the shelves light the *shelf*; they rake across the front
 * of a box and leave it in the darkest band of its ramp. Retail solves this
 * with a spot on each facing, and so does this: a tight, short-range lamp in
 * front of every product, which is what makes the stock the brightest thing in
 * the room instead of the woodwork.
 *
 * Out-of-stock keeps a dimmer one — noticeably darker than its neighbours, but
 * no longer a silhouette.
 */
export function ProductLights() {
  const warm = palette.amber200();

  return (
    <>
      {projects.map((project) => {
        const [x, y, z] = placement(project.shelf, project.slot);
        const height = shapeHeight[project.shape] * PRODUCT_SCALE;
        const lit = project.status === 'in-stock';

        return (
          <pointLight
            key={project.id}
            position={[x, y + height * 0.72, z + 0.62]}
            intensity={lit ? 2.4 : 1.2}
            distance={1.9}
            decay={2}
            color={warm}
          />
        );
      })}
    </>
  );
}
