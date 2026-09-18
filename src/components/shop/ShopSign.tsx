import { profile } from '../../data/profile';

/**
 * The fascia board over the shelves. This is the h1, and it is also the three
 * seconds a recruiter gives the page: the name, what I do, and what the shelves
 * are — before anyone has moved the mouse.
 */
export function ShopSign() {
  return (
    <header className="relative pt-1 pb-7 sm:pb-9 lg:pb-7">
      <div className="relative inline-block max-w-full">
        {/* Two little chains, so it reads as hung rather than typeset. */}
        <span aria-hidden="true" className="bg-ink-500 absolute -top-2 left-8 h-2 w-px" />
        <span aria-hidden="true" className="bg-ink-500 absolute -top-2 right-8 h-2 w-px" />

        <div className="border-oak-700 bg-ink-700/80 relative -rotate-[0.5deg] border-2 px-5 py-3 shadow-[0_8px_20px_rgba(12,10,9,0.5)] sm:px-7 sm:py-4">
          {/* Bolts */}
          <span aria-hidden="true" className="bg-oak-300/60 absolute top-2 left-2 size-1.5 rounded-full" />
          <span aria-hidden="true" className="bg-oak-300/60 absolute top-2 right-2 size-1.5 rounded-full" />
          <span aria-hidden="true" className="bg-oak-300/60 absolute bottom-2 left-2 size-1.5 rounded-full" />
          <span aria-hidden="true" className="bg-oak-300/60 absolute right-2 bottom-2 size-1.5 rounded-full" />

          <h1 className="font-sign text-paper-100 text-[2.1rem] leading-[0.95] sm:text-5xl lg:text-[2.9rem]">
            {profile.shopName}
          </h1>
          <p className="font-till text-amber-300/80 mt-1.5 text-[0.55rem] tracking-[0.3em] uppercase sm:text-[0.62rem]">
            {profile.name} · est. 2003
          </p>
        </div>
      </div>

      <p className="text-paper-300 mt-4 max-w-[48ch] text-[0.95rem] leading-relaxed sm:text-base">
        {profile.standfirst}
      </p>
      <p className="font-till text-paper-500 mt-2 text-[0.6rem] tracking-[0.16em] uppercase">
        <span className="text-accent" aria-hidden="true">
          ●
        </span>{' '}
        Every product on the shelves is a project — pick one up
      </p>
    </header>
  );
}
