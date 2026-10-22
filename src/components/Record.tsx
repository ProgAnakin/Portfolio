import { record } from '../data/profile';
import { Section } from './ui';

/**
 * Where item prices sit, on a log scale.
 *
 * The point it makes is the section's whole argument: almost everything sells
 * for under €100 and the big tickets are a handful a year, so the revenue was
 * built out of baskets. Drawn linear, the €8 to €100 band would be a sliver at
 * the left edge and the picture would say the opposite. One series, so the
 * two marks are labelled directly and there is no legend.
 */
function PriceScale() {
  const { min, max, bulkTo, rare } = record.scale;
  const at = (value: number) =>
    ((Math.log(value) - Math.log(min)) / (Math.log(max) - Math.log(min))) * 100;
  const ticks = [10, 20, 50, 100, 200, 500];

  return (
    <figure className="border-line mt-16 border-t pt-5">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span className="text-ink text-[0.9375rem] font-semibold">
          What things cost on the corner
        </span>
        <span className="text-ink-3 text-sm">Price per item, log scale</span>
      </figcaption>

      <div className="relative mt-8 h-28" aria-hidden="true">
        <div className="absolute top-0 left-0 text-sm" style={{ width: `${at(bulkTo)}%` }}>
          <p className="text-ink font-medium">Most of the range</p>
          <p className="text-ink-3">€8 to €100</p>
        </div>
        <div
          className="absolute top-0 max-w-[50%] text-right text-sm"
          style={{ right: `${100 - at(rare.to)}%` }}
        >
          <p className="text-ink font-medium">€500 to €600</p>
          <p className="text-ink-3">{rare.label}</p>
        </div>

        <div className="bg-line absolute inset-x-0 top-[62px] h-px" />
        <div
          className="bg-ink absolute top-[58px] left-0 h-[9px]"
          style={{ width: `${at(bulkTo)}%` }}
        />
        <div
          className="border-ink absolute top-[58px] h-[9px] border"
          style={{ left: `${at(rare.from)}%`, width: `${at(rare.to) - at(rare.from)}%` }}
        />

        {ticks.map((tick) => (
          <div key={tick} className="absolute top-[70px]" style={{ left: `${at(tick)}%` }}>
            <div className="bg-line h-2 w-px" />
            <span className="text-ink-3 absolute top-3 -translate-x-1/2 text-xs tabular-nums">
              €{tick}
            </span>
          </div>
        ))}
      </div>

      <p className="sr-only">
        Most items sell for between €8 and €100. A few sell for €500 to €600: {rare.label}.
      </p>
    </figure>
  );
}

export function Record() {
  return (
    <Section id="record" name="Sales record" note={record.period}>
      <h3 className="head text-ink max-w-[22ch] text-[clamp(2rem,4.4vw,3.5rem)]">
        {record.heading}
      </h3>

      <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
        {record.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>

      <dl className="border-line mt-14 border-t">
        {record.facts.map((fact) => (
          <div
            key={fact.label}
            className="border-line grid gap-1 border-b py-4 sm:grid-cols-[11rem_1fr] sm:gap-6"
          >
            <dt className="text-ink-3 text-sm sm:pt-0.5">{fact.label}</dt>
            <dd className="text-ink">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <PriceScale />
    </Section>
  );
}
