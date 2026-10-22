/**
 * Who this is, what he has done, and how to reach him.
 *
 * Every figure on this page has to survive being asked "how do you know?" out
 * loud, in an interview, by someone who has sold for a living. So the rule for
 * this file: a number goes in only if it is one I can defend from memory, and
 * the context that makes it honest goes in beside it. A low-ticket shop floor
 * is not an enterprise pipeline, and saying so first is what makes the rest of
 * it believable.
 */

export interface ContactLink {
  id: string;
  label: string;
  value: string;
  /** Absent when there is nothing to link to. Rendered as plain text. */
  href?: string;
}

/** One headline figure: the value, what it counts, and the fine print. */
export interface Figure {
  value: string;
  label: string;
  note: string;
}

export const profile = {
  name: 'Costanzo Annichini',
  role: 'Technology Consultant',
  employer: 'Webidoo Store',
  location: 'Portugal · Italy',
  /** The first sentence anyone reads. */
  lead: 'I sell technology on a shop floor — and build the software that shop floors are missing.',
  standfirst:
    'Technology consultant at Webidoo Store. Top seller at every point of sale I have worked, on a ticket where most things cost under €100. In the evenings I build products: a CRM for shop counters, a sales-call trainer, a kiosk, and a sports-analytics company I co-founded.',
  languages: [
    { name: 'Italian', level: 'Native' },
    { name: 'Portuguese', level: 'Native' },
    { name: 'English', level: 'Professional' },
  ],
  openTo: {
    roles: ['Sales', 'SDR / BDR', 'Business development'],
    markets: ['Portugal', 'Italy', 'Remote (EU)'],
  },
};

/**
 * The row under the headline.
 *
 * Personal figures only, from the job. Nothing summed across the projects:
 * most of those were built unpaid, and a total would imply a commercial record
 * that isn't there. The projects carry their own numbers.
 */
export const figures: Figure[] = [
  {
    value: '€65k',
    label: 'sold in my first 8 months',
    note: 'Webidoo Store, low-ticket consumer tech.',
  },
  {
    value: '25',
    label: 'items on one receipt',
    note: 'My record basket, around €35 an item.',
  },
  {
    value: '#1',
    label: 'seller at every point I have worked',
    note: 'Whatever the corner, whatever the footfall.',
  },
  {
    value: '4',
    label: 'products built alongside the job',
    note: 'One for sale, one co-founded, two to learn.',
  },
];

/**
 * The shop floor, said plainly.
 *
 * This is the part of the page a sales recruiter actually reads for, so it is
 * written as context first and claims second: what the ticket is, why that
 * makes revenue hard, and what I do about it.
 */
export const floor = {
  heading: 'Low ticket. Walk-in traffic. One chance per customer.',
  paragraphs: [
    'Webidoo Store runs technology corners inside department stores. I am the consultant on the corner: gadgets, gaming, beauty tech — from a €8 accessory to a €600 arcade cabinet. Nobody comes in for an appointment and nobody is on a contract — people walk past, and some of them stop.',
    'Most of the catalogue sells for under €100. On a ticket like that, revenue is not won with one big sale; it is built one basket at a time. My habit is two or three items on every receipt, because the second item is the one that answers the question the customer has not asked yet.',
  ],
  baskets: [
    { value: '2–3', label: 'items per receipt', note: 'the habit, not the exception' },
    { value: '25', label: 'items in one receipt', note: 'the record, ~€35 each' },
    { value: '€450', label: 'on 7–8 items', note: 'one of the big ones' },
  ],
  /** The item-price range, drawn as a scale. Euros. */
  scale: {
    min: 8,
    max: 700,
    bulkTo: 100,
    rare: { from: 500, to: 600, label: 'LED masks, arcade cabinets — a handful a year' },
  },
  christmas: {
    title: 'Christmas, alone on the corner',
    body: 'In my first year the store ran a daily prize for the most receipts in a day. I won it on one of the busiest days of the Christmas season, working the corner on my own — and one of my superiors wanted to hand me the award at a company event.',
  },
  trust: 'My manager leaves me to run a point of sale on my own.',
  quote: 'I don’t choose who walks past. I choose what happens once they stop.',
};

/** How I sell — four habits, in the order a sale happens. */
export const approach = [
  {
    title: 'Learn the product cold',
    body: 'A customer trusts the person who knows the answer before the question is finished. I learn the catalogue until I can explain any item in a sentence.',
  },
  {
    title: 'Match the room',
    body: 'How I speak, how I dress, how fast I go — it follows the person in front of me. Technology today; property or cars tomorrow. The product changes, the method does not.',
  },
  {
    title: 'Build the basket',
    body: 'Not one more item: the right next item. The accessory that makes the first thing better, offered because it does. Small tickets add up only if every sale is a little bigger than it walked in.',
  },
  {
    title: 'Follow up',
    body: 'Most sales are lost after the customer says “I’ll think about it”. I keep the thread — which is exactly why I built a CRM for the shop counter.',
  },
];

export const contacts: ContactLink[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: '/in/costanzoannichini',
    // `www`, not a language subdomain: it hands each visitor LinkedIn in their
    // own language.
    href: 'https://www.linkedin.com/in/costanzoannichini',
  },
  {
    id: 'github',
    label: 'GitHub',
    value: 'ProgAnakin',
    href: 'https://github.com/ProgAnakin',
  },
  {
    // Deliberately not published: a personal address on a page anyone can
    // scrape is a spam problem, not a contact method. LinkedIn is the door.
    id: 'email',
    label: 'Email',
    value: 'Available on request',
  },
];
