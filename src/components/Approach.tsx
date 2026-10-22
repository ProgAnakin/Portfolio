import { approach } from '../data/profile';
import { Reveal, Section } from './ui';

export function Approach() {
  return (
    <Section id="approach" index="03" name="How I sell">
      <Reveal>
        <h3 className="font-display text-chalk-100 max-w-3xl text-4xl leading-[1.05] text-balance sm:text-5xl">
          Four habits, in the order a sale happens.
        </h3>
      </Reveal>
      <ol className="bg-ink-700 border-ink-700 mt-14 grid gap-px border-y sm:grid-cols-2 lg:grid-cols-4">
        {approach.map((step, i) => (
          <li
            key={step.title}
            className="bg-ink-950 py-7 pr-6 sm:[&:nth-child(2n)]:pl-6 lg:[&:not(:first-child)]:pl-6"
          >
            <Reveal delay={i * 0.06}>
              <p className="label tabular-nums">{String(i + 1).padStart(2, '0')}</p>
              <h4 className="text-chalk-100 mt-4 text-lg font-medium">{step.title}</h4>
              <p className="mt-3 text-sm leading-relaxed">{step.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
