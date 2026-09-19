/**
 * How far the pendant is currently swinging, in radians.
 *
 * The lamp is geometry and the light it casts is a spot light on the other
 * side of the scene graph, so one of them has to tell the other. A swinging
 * shade whose pool of light stays nailed to the counter is the tell that gives
 * a scene away, and this is the cheapest honest fix: one record, written by
 * the lamp and read by the light, with no three.js in it.
 */
export const pendulum = { tiltX: 0, tiltZ: 0 };

/**
 * Distance from the ceiling rose to the shade.
 *
 * Long, because it now starts at the real ceiling and still has to finish low
 * over the counter, and because a long pendulum swings slowly and heavily
 * rather than twitching. The angular cap comes down to match: the same angle
 * on a longer arm is a much wider sweep.
 */
export const PENDANT_DROP = 2.08;
