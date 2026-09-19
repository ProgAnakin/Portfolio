import { motion, useTransform } from 'framer-motion';
import { menu, profile } from '../data/profile';
import { usePointerParallax } from '../hooks/usePointerParallax';

/**
 * The editorial layer.
 *
 * The room is a photograph of a place; this is the print on top of it. Real
 * DOM text — selectable, indexable, readable by a screen reader — set at
 * signage scale and deliberately crossing into the scene rather than sitting
 * politely beside it. It is also what answers "who is this?" in the three
 * seconds before anyone moves the mouse.
 *
 * Both blocks lean with the cursor, a few pixels, against the way the camera
 * leans. Without it the room moves under a layer of type that is nailed to the
 * glass, and the two never read as one space — this is the cheapest fix for
 * that there is, since it is a transform and nothing reflows.
 *
 * Short windows get their own sizes rather than the same type scaled by width.
 * A 520-pixel-tall browser is not a phone; it is a desktop with the window
 * dragged down, and letting the headline run off the bottom of it is the sort
 * of thing that reads as a broken page rather than a cropped one.
 */
export function StageOverlay() {
  const { x, y, enabled } = usePointerParallax();

  // The type sits in front of the room, so it travels further than the room
  // does — that difference is the whole effect.
  const headlineX = useTransform(x, (v) => (enabled ? -v * 16 : 0));
  const headlineY = useTransform(y, (v) => (enabled ? -v * 9 : 0));
  const boardX = useTransform(x, (v) => (enabled ? -v * 9 : 0));
  const boardY = useTransform(y, (v) => (enabled ? -v * 5 : 0));

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {/* Bottom left: who this is, at the size a sign is. */}
      <motion.div
        style={{ x: headlineX, y: headlineY }}
        className="absolute bottom-[5%] left-[3%] max-w-[min(34rem,46vw)] [@media(max-height:640px)]:bottom-[3%]"
      >
        {/* Two blocks with a real space between them, not a <br>: a line break
            leaves no word boundary, so the accessible name would be read out
            as "CostanzoAnnichini". */}
        <h1 className="shop-megatype text-paper-100 text-[clamp(2.4rem,5.2vw,4.6rem)] [@media(max-height:640px)]:text-[clamp(1.7rem,3.4vw,2.6rem)]">
          <span className="block">Costanzo</span>{' '}
          <span className="text-amber-300 block">Annichini</span>
        </h1>
        <div className="bg-accent mt-3 mb-3 h-[3px] w-24 [@media(max-height:640px)]:mt-2 [@media(max-height:640px)]:mb-2" />
        <p className="text-paper-300 pointer-events-auto max-w-[38ch] text-[clamp(0.85rem,1.05vw,1rem)] leading-relaxed [@media(max-height:640px)]:max-w-[44ch] [@media(max-height:640px)]:text-[0.78rem]">
          {profile.standfirst}
        </p>
        <p className="font-till text-paper-500 mt-3 text-[0.58rem] tracking-[0.18em] uppercase [@media(max-height:560px)]:hidden">
          <span className="text-accent" aria-hidden="true">
            ●
          </span>{' '}
          Pick something up — or drag it off the shelf
        </p>
      </motion.div>

      {/* Top right: the board on the wall, over the counter. */}
      <motion.section
        id="about"
        aria-labelledby="about-heading"
        style={{ x: boardX, y: boardY }}
        className="pointer-events-auto absolute top-[11%] right-[2.5%] hidden w-[min(20rem,28vw)] [@media(max-aspect-ratio:3/2)]:w-[min(23rem,36vw)] -rotate-[0.6deg] scroll-mt-24 border-2 border-[#3b2f27] bg-[#161a18]/92 px-4 py-3.5 shadow-[0_18px_40px_rgba(12,10,9,0.7)] backdrop-blur-[1px] lg:block xl:w-[23rem] xl:px-5 xl:py-4 [@media(max-height:640px)]:top-[6%] [@media(max-height:640px)]:px-3 [@media(max-height:640px)]:py-2.5"
      >
        <h2
          id="about-heading"
          className="font-sign text-paper-100/90 text-center text-xl tracking-[0.04em] [@media(max-height:640px)]:text-base"
          style={{ textShadow: '0 0 14px rgba(237,230,218,0.2)' }}
        >
          Today&rsquo;s menu
        </h2>
        <p className="font-till text-paper-500 mt-1 text-center text-[0.5rem] tracking-[0.22em] uppercase">
          {profile.location}
        </p>
        <dl className="mt-3 space-y-2 xl:space-y-2.5 [@media(max-height:640px)]:mt-2 [@media(max-height:640px)]:space-y-1">
          {menu.map((item) => (
            <div key={item.name}>
              <div className="flex items-baseline gap-2">
                <dt className="text-paper-100/85 text-[0.78rem] leading-snug xl:text-[0.82rem] [@media(max-height:640px)]:text-[0.72rem]">
                  {item.name}
                </dt>
                <span aria-hidden="true" className="border-paper-500/30 mb-1 grow border-b border-dotted" />
                <span className="font-till text-paper-500 shrink-0 text-[0.5rem] tracking-[0.14em]">
                  {item.price}
                </span>
              </div>
              <dd className="text-paper-500 mt-0.5 text-[0.68rem] leading-snug xl:text-[0.72rem] [@media(max-height:640px)]:text-[0.62rem]">
                {item.note}
              </dd>
            </div>
          ))}
        </dl>
      </motion.section>
    </div>
  );
}
