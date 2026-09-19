import { useEffect, useRef } from 'react';
import type { Brand } from '../data/projects';
import { drawMark } from '../three/logos';

/**
 * A project's mark, in the DOM.
 *
 * The same drawing code that prints the mark onto the packaging renders it
 * here, so the sheet and the box can never disagree about what a brand looks
 * like. Decorative — the project's name is right beside it.
 */
export function BrandMark({ brand, size = 64 }: { brand: Brand; size?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const node = canvas.current;
    if (!node) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    node.width = size * dpr;
    node.height = size * dpr;
    const ctx = node.getContext('2d');
    if (!ctx) return;

    const paint = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      drawMark(ctx, size / 2, size / 2, size * 0.64, brand);
    };

    paint();
    // Redraw once the webfonts land, or a lettered mark is set in Times.
    document.fonts?.ready.then(paint).catch(() => {});
  }, [brand, size]);

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      style={{ width: size, height: size }}
      className="block shrink-0"
    />
  );
}
