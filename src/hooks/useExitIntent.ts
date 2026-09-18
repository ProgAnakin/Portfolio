import { useEffect, useState } from 'react';

/**
 * Fires once when someone looks like they are leaving.
 *
 * The signal is the pointer crossing out of the top of the window — towards
 * the address bar, the tabs, the close button. It is a nudge and nothing more:
 * no `beforeunload` dialog, nothing that argues with the browser, nothing that
 * can trap anybody. A shop can call after you; it cannot lock the door.
 *
 * `after` keeps it from firing on someone who has barely arrived, and it only
 * ever fires once per visit.
 */
export function useExitIntent({
  enabled,
  afterMs = 7000,
}: {
  enabled: boolean;
  afterMs?: number;
}): boolean {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!enabled || leaving) return;
    // Touch devices have no pointer to lose, so there is no signal to read.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const armedAt = Date.now() + afterMs;

    const onOut = (event: PointerEvent | MouseEvent) => {
      if (Date.now() < armedAt) return;
      if (event.clientY > 6) return;
      // relatedTarget is null when the pointer has left the document itself.
      if ((event as PointerEvent).relatedTarget) return;
      setLeaving(true);
    };

    document.addEventListener('mouseout', onOut);
    return () => document.removeEventListener('mouseout', onOut);
  }, [enabled, leaving, afterMs]);

  return leaving;
}
