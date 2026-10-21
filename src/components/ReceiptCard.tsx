import { menu, profile, receipt } from '../data/profile';
import { tornEdge } from '../lib/tornEdge';

/**
 * What the shopkeeper does all day, printed.
 *
 * The page ends up explaining three projects very well and the person behind
 * them barely at all — the board that answers it hangs in the room, which is
 * set dressing on a wide screen and not rendered below `lg`. This is that
 * board, on the casebook, in the one form this site already owns: the till
 * roll. Each thing he does is a line item and each one has a price, because
 * that is how a shop writes what it can do for you, and "NO EXTRA" against
 * three languages says more than a bullet would.
 *
 * It is the only light object on a dark page, and the only one set at an
 * angle. Both on purpose: a recruiter who scrolls past everything else stops
 * at the piece of paper.
 */
export function ReceiptCard() {
  return (
    <figure className="w-full max-w-[22rem] -rotate-[1.1deg] drop-shadow-[0_22px_45px_rgba(6,5,4,0.6)]">
      <div className="bg-paper-100 text-ink-900 font-till px-5 pt-5 pb-4">
        <p className="text-[0.62rem] font-bold tracking-[0.2em] uppercase">{profile.shopName}</p>
        <p className="mt-0.5 flex items-baseline justify-between text-[0.52rem] tracking-[0.14em] uppercase opacity-60">
          <span>{receipt.till}</span>
          <span>{profile.location}</span>
        </p>

        <div aria-hidden="true" className="border-ink-900/35 my-3 border-t border-dashed" />

        <ul className="space-y-2.5">
          {menu.map((item) => (
            <li key={item.name}>
              <div className="flex items-baseline gap-2">
                <span className="text-[0.74rem] leading-snug font-bold">{item.name}</span>
                <span
                  aria-hidden="true"
                  className="border-ink-900/30 mb-1 grow border-b border-dotted"
                />
                <span className="shrink-0 text-[0.52rem] tracking-[0.12em] whitespace-nowrap opacity-70">
                  {item.price}
                </span>
              </div>
              <p className="mt-0.5 text-[0.66rem] leading-snug opacity-65">{item.note}</p>
            </li>
          ))}
        </ul>

        <div aria-hidden="true" className="border-ink-900/35 my-3 border-t border-dashed" />

        <p className="flex items-baseline justify-between text-[0.58rem] font-bold tracking-[0.14em] uppercase">
          <span>Total</span>
          <span>{receipt.footer}</span>
        </p>
        <p className="mt-2 text-center text-[0.5rem] tracking-[0.16em] uppercase opacity-45">
          {receipt.operator} · {receipt.thanks}
        </p>
      </div>

      {/* Torn off the reel, same tear as the directory by the door. */}
      <svg
        viewBox="0 0 200 7"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="-mt-px block h-2 w-full"
      >
        <path d={tornEdge()} fill="var(--color-paper-100)" />
      </svg>

      <figcaption className="sr-only">
        A printed receipt listing what Costanzo Annichini does: {menu.map((i) => i.name).join(', ')}.
      </figcaption>
    </figure>
  );
}
