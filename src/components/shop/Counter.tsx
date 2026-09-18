import { CashRegister } from './CashRegister';
import { CounterBlock } from './CounterBlock';
import { PendantLamp } from './PendantLamp';
import { Shopkeeper } from './Shopkeeper';
import { Telephone } from './Telephone';

/**
 * The checkout: a lamp, a shopkeeper, and two things worth touching.
 *
 * Everything is absolutely placed inside one fixed-height box, measured off
 * the same two variables as the rest of the scene, so the lamp's cone always
 * lands on the counter top and the counter always cuts the shopkeeper at the
 * waist. The block is painted last — that is the whole masking trick.
 */
export function Counter({ onPrint }: { onPrint: () => void }) {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="shop-counter relative h-[calc(var(--counter-item-h)*3+var(--counter-block-h))] scroll-mt-24"
    >
      <h2 id="contact-heading" className="sr-only">
        The counter — contact and receipt
      </h2>

      <PendantLamp className="pointer-events-none absolute top-0 left-[66%] z-0 h-[calc(var(--counter-item-h)*2.9)] w-[54%] -translate-x-1/2 sm:w-[46%]" />

      <Shopkeeper className="pointer-events-none absolute bottom-[calc(var(--counter-block-h)*0.62)] left-[47%] z-0 h-[calc(var(--counter-item-h)*3.1)] w-auto -translate-x-1/2" />

      <div className="absolute inset-x-0 bottom-[var(--counter-block-h)] z-10 flex h-[calc(var(--counter-item-h)*1.35)] items-end justify-between px-5 sm:px-9">
        <Telephone />
        <CashRegister onPrint={onPrint} />
      </div>

      <CounterBlock className="absolute inset-x-0 bottom-0 z-20 block h-[var(--counter-block-h)] w-full" />
    </section>
  );
}
