/**
 * A spring that overshoots.
 *
 * The motion personality for the whole shop is *toy*: things are light, they
 * arrive past where they are going and settle back. Linear easing would make
 * these objects feel like UI; this makes them feel like plastic.
 */
export interface SpringState {
  value: number;
  velocity: number;
}

export function spring(
  state: SpringState,
  target: number,
  dt: number,
  stiffness = 190,
  damping = 12,
): void {
  // Clamp dt so a dropped frame cannot launch the object across the room.
  const step = Math.min(dt, 1 / 30);
  state.velocity += (target - state.value) * stiffness * step;
  state.velocity *= Math.exp(-damping * step);
  state.value += state.velocity * step;
}

export const makeSpring = (value = 0): SpringState => ({ value, velocity: 0 });
