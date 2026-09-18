/**
 * Everything about the shopkeeper: the sign over the door, the chalkboard
 * menu on the wall, and what the telephone tells you when you pick it up.
 */

export interface ContactLink {
  id: string;
  label: string;
  value: string;
  href: string;
}

export interface MenuItem {
  name: string;
  note: string;
  /** Right-hand column of the chalkboard — kept short, like a price. */
  price: string;
}

export const profile = {
  name: 'Costanzo Annichini',
  /** The sign over the shop door. */
  shopName: 'ANNICHINI & CO.',
  /** Read in under three seconds, before anyone moves the mouse. */
  standfirst:
    'Sales professional, 23. Tech retail by trade, software by habit — everything on these shelves is something I built, sold, or both.',
  location: 'Portugal · Italy',
  languages: ['Italian (native)', 'Portuguese (native)', 'English'],
};

export const contacts: ContactLink[] = [
  {
    id: 'email',
    label: 'Email',
    value: 'costatocb@gmail.com',
    href: 'mailto:costatocb@gmail.com',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: '/in/costanzo-annichini',
    // TODO(costanzo): confirm the exact LinkedIn vanity URL.
    href: 'https://www.linkedin.com/in/costanzo-annichini',
  },
  {
    id: 'github',
    label: 'GitHub',
    value: 'ProgAnakin',
    href: 'https://github.com/ProgAnakin',
  },
];

/** The chalkboard behind the counter — "about me", written as a menu. */
export const menu: MenuItem[] = [
  {
    name: 'Selling on the floor',
    note: 'Tech retail. Real customers, real objections, real targets.',
    price: 'DAILY',
  },
  {
    name: 'Building the thing I wished we had',
    note: 'Shop-floor problems, shipped as software with AI tooling.',
    price: 'NIGHTLY',
  },
  {
    name: 'Getting a product in front of people',
    note: 'Outreach, partnerships and go-to-market for a SaaS I co-founded.',
    price: 'BY THE CLUB',
  },
  {
    name: 'Three languages',
    note: 'Italian and Portuguese native, English working.',
    price: 'NO EXTRA',
  },
];

/** The till receipt doubles as the CV. */
export const cv = {
  href: '/costanzo-annichini-cv.pdf',
  filename: 'costanzo-annichini-cv.pdf',
};
