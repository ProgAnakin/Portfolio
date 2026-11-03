import { record } from '../data/profile';
import { Section } from './ui';

/** The confirmed lowest and highest prices of individual items sold. */
function ItemPrices() {
  return (
    <figure className="border-line mt-16 border-t pt-5">
      <figcaption className="text-ink text-[0.9375rem] font-semibold">
        Individual items I’ve sold
      </figcaption>
      <dl className="mt-6 grid grid-cols-2 gap-6">
        {record.itemPrices.map((price) => (
          <div key={price.label}>
            <dt className="text-ink-3 text-sm">{price.label}</dt>
            <dd className="figure text-ink mt-3 text-3xl sm:text-4xl">{price.value}</dd>
          </div>
        ))}
      </dl>
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

      <section className="mt-14" aria-labelledby="progression-name">
        <h3 id="progression-name" className="wide text-ink text-sm font-semibold">
          Progression at Webidoo Store
        </h3>
        <ol className="border-line mt-5 grid gap-6 border-t pt-5 sm:grid-cols-3">
          {record.progression.map((step) => (
            <li key={step.title}>
              <p className="text-ink font-semibold">{step.title}</p>
              <p className="mt-2 text-sm">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
      <ItemPrices />
    </Section>
  );
}
