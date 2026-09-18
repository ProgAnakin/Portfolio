import { useEffect, useState } from 'react';

export type SceneTier = 'off' | 'lite' | 'full';

/**
 * Decides whether this device gets the room or the drawing.
 *
 * The 3D shop is an enhancement, never the only way in: if WebGL is missing,
 * motion is unwelcome, data is metered or the screen is a phone, the
 * illustrated shop is served instead — and that version is complete, not a
 * consolation.
 */
export function useSceneQuality(): SceneTier {
  const [tier, setTier] = useState<SceneTier>('off');

  useEffect(() => {
    const decide = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off';

      // Metered or explicitly frugal connections keep the lightweight scene.
      const conn = (navigator as { connection?: { saveData?: boolean } }).connection;
      if (conn?.saveData) return 'off';

      // The room is wide, so it needs a wide window. Phones and tablets get
      // the illustrated shop, which has its own art direction at each size —
      // unrolled vertically on a phone, real shelves with the counter beneath
      // on a tablet. That is a responsive decision, not a fallback.
      if (!window.matchMedia('(min-width: 64rem)').matches) return 'off';

      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
      if (!gl) return 'off';

      const cores = navigator.hardwareConcurrency ?? 4;
      return cores >= 6 ? 'full' : 'lite';
    };

    setTier(decide());

    const mq = window.matchMedia('(min-width: 64rem)');
    const onChange = () => setTier(decide());
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return tier;
}
