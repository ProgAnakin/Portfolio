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

export const profile = {
  name: 'Costanzo Annichini',
  role: 'Technology Consultant',
  employer: 'Webidoo Store',
  languages: [
    { name: 'Italian', level: 'Native' },
    { name: 'Portuguese', level: 'Native' },
    { name: 'English', level: 'Fluent' },
  ],
  lead: 'I sell consumer technology in store. In my first eight months I sold €65,000, mostly in products under €100. Outside work I build software for people who sell.',
  openTo: 'Sales, SDR and business development roles in Portugal, Italy or remote in the EU.',
};

/**
 * The row on the cover. Personal figures from the job only: nothing summed
 * across the projects, most of which were built unpaid.
 */
export const figures: Figure[] = [
  { value: '€65k', label: 'sold in my first 8 months' },
  { value: '25', label: 'items on one receipt, my record' },
  { value: '#1', label: 'seller at every point of sale I’ve worked' },
  { value: '4', label: 'products built outside work' },
];

export const record = {
  period: 'Webidoo Store, 2025 to now',
  heading: 'Most of what I sell costs under €100. The total comes from the basket.',
  paragraphs: [
    'Webidoo Store sells technology from corners inside department stores. I’m the consultant on the corner: gadgets, gaming and beauty tech, from an €8 accessory to a €600 arcade cabinet. There are no appointments. People walk past, and some of them stop.',
    'At these prices one sale doesn’t move the month. The second and third item do: something that goes with what the customer came for, or that answers a question they hadn’t asked yet.',
  ],
  facts: [
    { label: 'Revenue', value: '€65,000 in my first eight months' },
    { label: 'Usual basket', value: '2 to 3 items per receipt' },
    { label: 'Record basket', value: '25 items on one receipt, around €35 each' },
    { label: 'Bigger receipts', value: '€450 on 7 or 8 items. The largest, around €700' },
    { label: 'Ranking', value: 'Top seller at every point of sale I’ve worked' },
    {
      label: 'Christmas',
      value:
        'Won the store’s daily prize for most receipts, on one of the busiest days of the season, running the corner alone. One of my superiors wanted to present it at a company event.',
    },
    { label: 'Trust', value: 'My manager leaves me to run a point of sale on my own' },
  ] satisfies Fact[],
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
