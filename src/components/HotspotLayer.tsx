import { useEffect, useRef } from 'react';
import { hotspotFrames, input, projection } from '../three/hotspots';

export interface Hotspot {
  id: string;
  label: string;
  /** Base hit size in CSS pixels at scale 1. */
  size: [number, number];
  onActivate: () => void;
  /**
   * How far this object may be pulled, in world units, worked out from the
   * shelf around it. Absent means it does not move.
   */
  drag?: { up: number; down: number; side: number };
  anchorId?: string;
  /** Rendered above the control while it is hovered or focused. */
  popover?: React.ReactNode;
}

/**
 * The controls for the room.
 *
 * Ordinary buttons in ordinary DOM, moved over the canvas by an animation
 * frame that reads the projected positions. Everything a keyboard or a screen
 * reader needs is here — labels, focus order, focus rings — while the canvas
 * itself stays `aria-hidden` decoration.
 */
export function HotspotLayer({ hotspots }: { hotspots: Hotspot[] }) {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const root = layer.current;
      if (root) {
        for (const node of root.children) {
          const el = node as HTMLElement;
          const id = el.dataset.hotspot;
          const frame = id ? hotspotFrames.get(id) : undefined;
          if (!frame || !frame.visible) {
            el.style.visibility = 'hidden';
            continue;
          }
          el.style.visibility = 'visible';
          el.style.transform = `translate3d(${frame.x}px, ${frame.y}px, 0) translate(-50%, -50%) scale(${Math.max(0.55, Math.min(1.8, frame.scale)).toFixed(3)})`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={layer} className="pointer-events-none absolute inset-0 z-30">
      {hotspots.map((spot) => (
        <div
          key={spot.id}
          data-hotspot={spot.id}
          className="pointer-events-none absolute top-0 left-0"
          style={{ visibility: 'hidden' }}
        >
          <HotspotButton spot={spot} />
        </div>
      ))}
    </div>
  );
}

function HotspotButton({ spot }: { spot: Hotspot }) {
  const state = input(spot.id);
  const wrapper = useRef<HTMLDivElement>(null);
  const popover = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  /**
   * Show the card, and put it somewhere it can actually be read.
   *
   * It opens above the control, which is right for something standing on a
   * counter. For a product on the top shelf it is not: the control is already
   * near the top of the window and the card opens off the top edge of it —
   * which is how the shelf talker came to be a card with no heading. So it is
   * measured once on open and flipped below when there is no room above, and
   * nudged sideways when it would run off either edge.
   */
  const showPopover = (show: boolean) => {
    const el = popover.current;
    if (!el) return;

    el.style.display = show ? 'block' : 'none';
    if (!show) return;

    // Back to the default placement first, or the previous nudge is measured
    // as if it were where the card naturally wants to sit.
    el.style.top = '';
    el.style.bottom = '';
    el.style.marginLeft = '';

    const EDGE = 10;
    const above = el.getBoundingClientRect();
    if (above.top < EDGE) {
      el.style.bottom = 'auto';
      el.style.top = '115%';
    }

    const box = el.getBoundingClientRect();
    const overflowLeft = EDGE - box.left;
    const overflowRight = box.right - (window.innerWidth - EDGE);
    if (overflowLeft > 0) el.style.marginLeft = `${Math.round(overflowLeft)}px`;
    else if (overflowRight > 0) el.style.marginLeft = `${-Math.round(overflowRight)}px`;
  };

  return (
    <div
      ref={wrapper}
      className="pointer-events-auto relative"
      onPointerEnter={() => {
        state.hovered = true;
        showPopover(true);
      }}
      onPointerLeave={() => {
        state.hovered = false;
        if (!state.dragging) showPopover(false);
      }}
      onBlur={(event) => {
        if (!wrapper.current?.contains(event.relatedTarget as Node | null)) {
          state.focused = false;
          showPopover(false);
        }
      }}
    >
      {spot.popover && (
        <div
          ref={popover}
          style={{ display: 'none' }}
          className="absolute bottom-[115%] left-1/2 -translate-x-1/2"
        >
          {spot.popover}
        </div>
      )}

      <button
        type="button"
        id={spot.anchorId}
        aria-label={spot.label}
        className="shop-hotspot"
        style={{ width: `${spot.size[0]}px`, height: `${spot.size[1]}px` }}
        onClick={() => {
          if (!moved.current) spot.onActivate();
          moved.current = false;
        }}
        onFocus={(event) => {
          state.focused = event.currentTarget.matches(':focus-visible');
          if (state.focused) showPopover(true);
        }}
        onPointerDown={(event) => {
          if (!spot.drag) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          state.dragging = true;
          state.dx = 0;
          state.dy = 0;
          moved.current = false;
        }}
        onPointerMove={(event) => {
          if (!state.dragging || !spot.drag) return;
          state.dx += event.movementX * projection.worldPerPixel;
          state.dy -= event.movementY * projection.worldPerPixel;
          // A shelf is not a table. The limits come from the plank above and
          // the next slot along, so a product can never be pulled through
          // either one.
          const { up, down, side } = spot.drag;
          state.dx = Math.max(-side, Math.min(side, state.dx));
          state.dy = Math.max(-down, Math.min(up, state.dy));
          if (Math.hypot(state.dx, state.dy) > 0.06) moved.current = true;
        }}
        onPointerUp={(event) => {
          if (!state.dragging) return;
          event.currentTarget.releasePointerCapture(event.pointerId);
          state.dragging = false;
          state.dx = 0;
          state.dy = 0;
        }}
        onKeyDown={(event) => {
          // The same lift, for people who never touch a mouse.
          if (!spot.drag) return;
          if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            state.dy = event.key === 'ArrowUp' ? spot.drag.up : 0;
          }
        }}
      />
    </div>
  );
}
