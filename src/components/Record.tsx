import { record } from '../data/profile';
import { Section } from './ui';

/** The confirmed lowest and highest prices of individual items sold. */
function ItemPrices() {
  return (
    <figure className="border-line mt-8 border-t pt-5">
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
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h3 className="head text-ink max-w-[18ch] text-[clamp(2.25rem,4.4vw,3.5rem)]">
            {record.heading}
          </h3>
          <div className="mt-7 space-y-5">
            {record.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          <ItemPrices />
        </div>
        <dl className="border-line border-t">
          {record.facts.map((fact, i) => (
            <div key={fact.label} className="border-line grid gap-1 border-b py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="text-ink-3 text-sm sm:pt-1">{fact.label}</dt>
              <dd className={i < 3 ? 'figure text-ink text-3xl' : 'text-ink text-base'}>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <section className="bg-paper-2 mt-12 p-6 sm:mt-16 sm:p-8" aria-labelledby="progression-name">
        <h3 id="progression-name" className="eyebrow text-ink">Progression at Webidoo Store</h3>
        <ol className="mt-7 grid gap-7 sm:grid-cols-3 sm:gap-8">
          {record.progression.map((step, i) => (
            <li key={step.title} className="border-line border-t pt-4">
              <span className="text-accent-dark eyebrow">{String(i + 1).padStart(2, '0')}</span>
              <p className="text-ink mt-3 text-lg font-semibold">{step.title}</p>
              <p className="mt-2 text-sm">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </Section>
  );
}
