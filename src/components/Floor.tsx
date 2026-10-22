import { floor } from '../data/profile';
import { Reveal, Section } from './ui';

/**
 * Where item prices sit, on a log scale.
 *
 * The point it makes is the whole argument of this section: almost everything
 * sells for under €100 and the big tickets are a handful a year, so the
 * revenue above was built out of baskets, not out of lucky sales. Linear, the
 * €8–€100 band would be a sliver at the left edge and the picture would say
 * the opposite of the truth.
 *
 * One series, so no legend; the two marks are labelled directly.
 */
function PriceScale() {
  const { min, max, bulkTo, rare } = floor.scale;
  const at = (value: number) =>
    ((Math.log(value) - Math.log(min)) / (Math.log(max) - Math.log(min))) * 100;
  const ticks = [10, 50, 100, 500];

  return (
    <figure className="border-ink-700 mt-14 border-t pt-6">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-chalk-100 text-sm">Where the prices sit</span>
        <span className="text-chalk-500 text-xs">Item price, € — log scale</span>
      </figcaption>

      <div className="relative mt-10 mb-2 h-24" aria-hidden="true">
        {/* Annotations above the track. */}
        <div className="absolute top-0 left-0 text-xs" style={{ width: `${at(bulkTo)}%` }}>
          <p className="text-chalk-100">Most of the catalogue</p>
          <p className="text-chalk-500">€8 – €100</p>
        </div>
        <div
          className="absolute top-0 text-right text-xs"
          style={{ right: `${100 - at(rare.to)}%`, maxWidth: '48%' }}
        >
          <p className="text-chalk-100">€500 – €600</p>
          <p className="text-chalk-500">{rare.label}</p>
        </div>

        {/* The track, the bulk band and the rare band. */}
        <div className="bg-ink-600 absolute inset-x-0 top-14 h-px" />
        <div
          className="bg-chalk-100 absolute top-[52px] left-0 h-[5px] rounded-full"
          style={{ width: `${at(bulkTo)}%` }}
        />
        <div
          className="border-chalk-300 absolute top-[52px] h-[5px] rounded-full border"
          style={{ left: `${at(rare.from)}%`, width: `${at(rare.to) - at(rare.from)}%` }}
        />

        {/* Ticks. */}
        {ticks.map((tick) => (
          <div key={tick} className="absolute top-[60px]" style={{ left: `${at(tick)}%` }}>
            <div className="bg-ink-600 h-2 w-px" />
            <span className="text-chalk-500 absolute top-3 -translate-x-1/2 text-[11px] tabular-nums">
              €{tick}
            </span>
          </div>
        ))}
      </div>

      {/* The same picture, said in words, for anyone who cannot see it. */}
      <p className="sr-only">
        Most items sell for between €8 and €100. A few sell for €500 to €600 — {rare.label}.
      </p>
    </figure>
  );
}

export function Floor() {
  return (
    <Section id="floor" index="01" name="On the floor">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-5">
          <h3 className="font-display text-chalk-100 text-4xl leading-[1.05] text-balance sm:text-5xl">
            {floor.heading}
          </h3>
        </Reveal>
        <Reveal delay={0.08} className="space-y-5 leading-relaxed lg:col-span-6 lg:col-start-7">
          {floor.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </Reveal>
      </div>

      <Reveal>
        <ul
          aria-label="Baskets"
          className="bg-ink-700 border-ink-700 mt-14 grid gap-px border-y sm:grid-cols-3"
        >
          {floor.baskets.map((basket) => (
            <li
              key={basket.label}
              className="bg-ink-950 flex items-baseline gap-4 py-5 sm:block sm:py-6 sm:pr-4 sm:not-first:pl-6"
            >
              <p className="text-chalk-100 w-20 shrink-0 text-3xl font-medium tracking-tight tabular-nums sm:w-auto">
                {basket.value}
              </p>
              <div className="sm:mt-2">
                <p className="text-chalk-100 text-sm">{basket.label}</p>
                <p className="text-chalk-500 text-xs">{basket.note}</p>
              </div>
            </li>
          ))}
        </ul>
        <PriceScale />
      </Reveal>

      <div className="mt-16 grid gap-6 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-6">
          <article className="border-ink-700 bg-ink-900 h-full rounded-2xl border p-6 sm:p-8">
            <p className="label">One day in particular</p>
            <h3 className="font-display text-chalk-100 mt-4 text-3xl">{floor.christmas.title}</h3>
            <p className="mt-4 leading-relaxed">{floor.christmas.body}</p>
            <p className="text-chalk-100 border-ink-700 mt-6 border-t pt-5 text-sm">
              {floor.trust}
            </p>
          </article>
        </Reveal>
        <Reveal delay={0.08} className="flex items-center lg:col-span-5 lg:col-start-8">
          <blockquote className="font-display text-chalk-100 text-3xl leading-tight text-balance italic sm:text-4xl">
            “{floor.quote}”
          </blockquote>
        </Reveal>
      </div>
    </Section>
  );
}
