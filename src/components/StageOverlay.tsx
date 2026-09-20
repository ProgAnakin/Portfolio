import { motion, useTransform } from 'framer-motion';
import { contacts, menu, profile } from '../data/profile';
import { shelfSummary } from '../data/projects';
import { usePointerParallax } from '../hooks/usePointerParallax';
import { useShop } from '../state/ShopContext';

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
/** The one contact that is a link. The rest live on the telephone. */
const linkedIn = contacts.find((c) => c.href)?.href ?? '#contact';

export function StageOverlay() {
  const { x, y, enabled } = usePointerParallax();
  // The store directory opens into this corner. Rather than land a sheet of
  // paper on a lit panel, the panel gets out of the way — see `directoryOpen`.
  const { directoryOpen } = useShop();

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
        {/* What is on the shelves, counted from the shelves. This replaced a
            row of totals: figures now sit on the project that earned them,
            because summing a co-founded company and two unpaid builds into one
            number is the single reading of this room that is not true. See
            `ProjectMetric` in `data/projects`. */}
        <p className="text-paper-500 pointer-events-auto mt-2 text-[clamp(0.76rem,0.9vw,0.86rem)] leading-relaxed [@media(max-height:640px)]:text-[0.7rem]">
          {shelfSummary()}
        </p>

        <p className="font-till text-paper-500 pointer-events-auto mt-3 text-[0.58rem] leading-relaxed tracking-[0.14em] uppercase [@media(max-height:560px)]:hidden">
          <span className="text-paper-300">Open to</span> {profile.openTo.roles.join(' · ')}
          <span className="block">
            {profile.openTo.markets.join(' · ')} —{' '}
            <a
              href={linkedIn}
              target="_blank"
              rel="noreferrer"
              className="text-accent underline decoration-dotted underline-offset-4"
            >
              LinkedIn
            </a>
          </span>
        </p>

        <p className="font-till text-paper-500/70 mt-2 text-[0.55rem] tracking-[0.18em] uppercase [@media(max-height:700px)]:hidden">
          <span className="text-accent" aria-hidden="true">
            ●
          </span>{' '}
          Pick something up — or drag it off the shelf
        </p>
      </motion.div>

      {/* Top right: the board on the wall, over the counter.

          A menu board, but the shop is tile, plaster and light now, and a
          brown-framed slate was the one piece of set dressing still arguing
          with that. This is a backlit panel: dark glass, a hairline bezel, a
          bleed of light along the top edge and a status line, with the menu
          conceit kept in the heading and the leaders. The tilt is gone too —
          a hung sign leans, a fixed display does not. */}
      <motion.section
        id="about"
        aria-labelledby="about-heading"
        style={{ x: boardX, y: boardY }}
        animate={{ opacity: directoryOpen ? 0 : 1, scale: directoryOpen ? 0.97 : 1 }}
        transition={{ duration: 0.22, ease: [0.16, 0.9, 0.3, 1] }}
        // Hidden from the pointer *and* from a screen reader while it is out
        // of the way: a faded panel is still a tab stop, and a link nobody can
        // see is a link nobody meant to follow.
        aria-hidden={directoryOpen || undefined}
        inert={directoryOpen || undefined}
        className="pointer-events-auto absolute top-[11%] right-[2.5%] hidden w-[min(20rem,28vw)] overflow-hidden rounded-[10px] bg-gradient-to-b from-[#12171b]/92 to-[#0b0f12]/94 px-4 pt-3 pb-3.5 ring-1 shadow-[0_22px_50px_rgba(6,9,12,0.65)] ring-white/10 backdrop-blur-[3px] lg:block xl:w-[23rem] xl:px-5 [@media(max-aspect-ratio:3/2)]:w-[min(23rem,36vw)] [@media(max-height:640px)]:top-[6%] [@media(max-height:640px)]:px-3 [@media(max-height:640px)]:pb-2.5"
      >
        {/* The bleed along the top edge, which is what makes a dark rectangle
            read as a panel that is switched on. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 -top-8 h-16 rounded-full bg-white/[0.07] blur-xl"
        />

        <div className="font-till text-paper-500 flex items-center justify-between text-[0.5rem] tracking-[0.22em] uppercase">
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="bg-amber-300 inline-block size-1 rounded-full" />
            After hours
          </span>
          <span>{profile.location}</span>
        </div>

        <h2
          id="about-heading"
          className="font-sign text-paper-100/92 mt-2 text-center text-xl tracking-[0.04em] [@media(max-height:640px)]:mt-1.5 [@media(max-height:640px)]:text-base"
          style={{ textShadow: '0 0 16px rgba(237,230,218,0.22)' }}
        >
          Today&rsquo;s menu
        </h2>

        <div aria-hidden="true" className="mt-2 h-px bg-white/10" />

        <dl className="mt-2.5 space-y-2 xl:space-y-2.5 [@media(max-height:640px)]:mt-2 [@media(max-height:640px)]:space-y-1.5">
          {menu.map((item) => (
            <div key={item.name}>
              <div className="flex items-baseline gap-2">
                <dt className="text-paper-100/90 text-[0.78rem] leading-snug xl:text-[0.82rem] [@media(max-height:640px)]:text-[0.72rem]">
                  {item.name}
                </dt>
                <span aria-hidden="true" className="mb-1 grow border-b border-white/12" />
                <span className="font-till text-paper-500 border-white/12 shrink-0 rounded-sm border px-1.5 py-0.5 text-[0.46rem] tracking-[0.14em]">
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
