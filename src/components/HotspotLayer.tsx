import { useEffect, useRef } from 'react';
import { hotspotFrames, input, projection } from '../three/hotspots';

export interface Hotspot {
  id: string;
  label: string;
  /** Base hit size in CSS pixels at scale 1. */
  size: [number, number];
  onActivate: () => void;
  draggable?: boolean;
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

  const showPopover = (show: boolean) => {
    if (popover.current) popover.current.style.display = show ? 'block' : 'none';
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
          if (!spot.draggable) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          state.dragging = true;
          state.dx = 0;
          state.dy = 0;
          moved.current = false;
        }}
        onPointerMove={(event) => {
          if (!state.dragging) return;
          state.dx += event.movementX * projection.worldPerPixel;
          state.dy -= event.movementY * projection.worldPerPixel;
          // A shelf is not a table: you can only pull it so far.
          state.dx = Math.max(-0.9, Math.min(0.9, state.dx));
          state.dy = Math.max(-0.25, Math.min(1.1, state.dy));
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
          if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            state.dy = event.key === 'ArrowUp' ? 0.5 : 0;
          }
        }}
      />
    </div>
  );
}
