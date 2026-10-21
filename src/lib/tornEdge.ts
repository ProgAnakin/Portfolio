/**
 * The path of a ragged tear across the bottom of a strip of till roll.
 *
 * Shared, because two different things are torn off the same reel: the store
 * directory by the door and the card at the foot of the casebook. Two copies
 * of this would drift and the paper would stop being the same paper.
 */
export function tornEdge(width = 200, tooth = 5): string {
  let d = `M0 0 H${width} V2.5 `;
  for (let x = width; x > 0; x -= tooth) {
    d += `L${(x - tooth / 2).toFixed(2)} 7 L${Math.max(x - tooth, 0).toFixed(2)} 2.5 `;
  }
  return `${d}Z`;
}
