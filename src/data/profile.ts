/**
 * Who this is, what he has done, and how to reach him.
 *
 * Every figure on this page has to survive being asked "how do you know?" out
 * loud, in an interview, by someone who has sold for a living. So a number goes
 * in only if I can defend it from memory, and the context that makes it honest
 * goes in beside it.
 *
 * On the writing: short sentences, first person, no slogans. It should read
 * like someone explaining their job across a table, because that is what a
 * recruiter is about to ask for.
 */

export interface ContactLink {
  id: string;
  label: string;
  value: string;
  /** Absent when there is nothing to link to. Rendered as plain text. */
  href?: string;
}

export interface Figure {
  value: string;
  label: string;
}

export interface Fact {
  label: string;
  value: string;
}

// Totals supplied from the sales records. No reporting end date was supplied.
export const sales = {
  revenue: 112483.67,
  receipts: 2186,
  items: 3056,
};

const number = (value: number, decimals = 0) =>
  new Intl.NumberFormat('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
const euros = (value: number) => `€${number(value, 2)}`;

export const profile = {
  name: 'Costanzo Annichini',
  role: 'Technology Consultant',
  employer: 'Webidoo Store',
  languages: [
    { name: 'Italian', level: 'Native' },
    { name: 'Portuguese', level: 'Native' },
    { name: 'English', level: 'Fluent' },
  ],
  lead: `I sell consumer technology in store. My sales records total ${euros(sales.revenue)} across ${number(sales.receipts)} receipts and ${number(sales.items)} items. Outside work I build software for people who sell.`,
  openTo: 'Sales, SDR and business development roles in Portugal, Italy or remote in the EU.',
};

/**
 * The row on the cover. Personal figures from the job only: nothing summed
 * across the projects, most of which were built unpaid.
 */
export const figures: Figure[] = [
  { value: `€${number(sales.revenue / 1000)}k`, label: 'in recorded sales' },
  { value: number(sales.receipts), label: 'receipts' },
  { value: number(sales.items), label: 'items sold' },
  { value: euros(sales.revenue / sales.receipts), label: 'average receipt' },
];

export const record = {
  period: 'Webidoo Store · recorded sales',
  heading: `${euros(sales.revenue / sales.items)} per item, on average. Thousands of sales add up.`,
  paragraphs: [
    'Webidoo Store sells technology from corners inside department stores. I’m the consultant on the corner: gadgets, gaming and beauty tech, from an €8 accessory to a €600 arcade cabinet. There are no appointments. People walk past, and some of them stop.',
    'I started on a 20-hour weekly contract, working across two locations. My hours increased to 30 a week, and I later received a permanent contract. My manager trusts me to run a point of sale on my own.',
  ],
  facts: [
    { label: 'Recorded sales', value: euros(sales.revenue) },
    { label: 'Receipts', value: number(sales.receipts) },
    { label: 'Items sold', value: number(sales.items) },
    { label: 'Average receipt', value: euros(sales.revenue / sales.receipts) },
    { label: 'Items per receipt', value: number(sales.items / sales.receipts, 2) },
    { label: 'Average item value', value: euros(sales.revenue / sales.items) },
    { label: 'Record basket', value: '25 items on one receipt' },
    { label: 'Ranking', value: 'Top seller at every point of sale I’ve worked' },
    {
      label: 'Christmas',
      value:
        'Won the store’s daily prize for most receipts, on one of the busiest days of the season, running the corner alone. One of my superiors wanted to present it at a company event.',
    },
  ] satisfies Fact[],
  progression: [
    { title: '20 hours a week', body: 'Started as a consultant, working across two locations.' },
    { title: '30 hours a week', body: 'My weekly contract hours increased.' },
    { title: 'Permanent contract', body: 'Later received a contract with no fixed end date.' },
  ],
  /** Item prices, drawn as a scale. Euros. */
  scale: {
    min: 8,
    max: 700,
    bulkTo: 100,
    rare: { from: 500, to: 600, label: 'LED masks and arcade cabinets, a handful a year' },
  },
};

/** How I work, in the order a sale happens. */
export const method = [
  {
    title: 'Know the range',
    body: 'I learn the products well enough to explain any of them in a sentence, so the answer is ready when the customer asks.',
  },
  {
    title: 'Read the customer',
    body: 'I adjust how I talk, and how I dress, to the person and to the product. I sell technology now. The same approach works for cars or property.',
  },
  {
    title: 'Add the right second item',
    body: 'I suggest what genuinely goes with the purchase. On a low ticket, that is where the month is made.',
  },
  {
    title: 'Follow up',
    body: 'A customer who says they’ll think about it is still a sale in progress. That is why I built Caderninho.',
  },
];

export const contacts: ContactLink[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'linkedin.com/in/costanzoannichini',
    // `www`, not a language subdomain: it hands each visitor LinkedIn in their
    // own language.
    href: 'https://www.linkedin.com/in/costanzoannichini',
  },
  {
    id: 'github',
    label: 'GitHub',
    value: 'github.com/ProgAnakin',
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
