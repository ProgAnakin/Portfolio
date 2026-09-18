/**
 * Paper grain and a vignette, laid over the whole shop.
 *
 * This is the single element doing most of the work of making a screen look
 * like a printed thing: without it the flat fills read as vector art.
 */
const GRAIN = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
     <filter id="g">
       <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch"/>
       <feColorMatrix type="saturate" values="0"/>
     </filter>
     <rect width="220" height="220" filter="url(#g)" opacity="0.5"/>
   </svg>`,
)}`;

export function GrainOverlay() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50">
      {/* Vignette — the shop is lit from inside, so the edges fall off. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(135% 115% at 50% 44%, transparent 55%, rgba(12,10,9,0.30) 84%, rgba(12,10,9,0.62) 100%)',
        }}
      />
      {/* Grain. */}
      <div
        className="absolute inset-0 opacity-[0.13] mix-blend-overlay"
        style={{ backgroundImage: `url("${GRAIN}")`, backgroundSize: '220px 220px' }}
      />
    </div>
  );
}
