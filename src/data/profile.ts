/**
 * Everything about the shopkeeper: the sign over the door, the chalkboard
 * menu on the wall, and what the telephone tells you when you pick it up.
 */

export interface ContactLink {
  id: string;
  label: string;
  value: string;
  /** Absent when there is nothing to link to yet. Rendered as plain text. */
  href?: string;
}

/**
 * A number a recruiter can act on.
 *
 * This array ships **empty**, and everything that renders it renders nothing
 * while it is. That is deliberate and it is the one thing on this site that
 * cannot be designed around: a sales portfolio without figures is a design
 * portfolio, and a sales portfolio with figures somebody else made up is a
 * liability in the first interview that asks about them.
 *
 * Fill it with numbers you can defend out loud, from your own records — quota
 * attainment, units or revenue, accounts opened, clubs onboarded, retention.
 * Three is plenty. Four is showing off.
 *
 *   { value: '112%', label: 'of target, FY25' }
 */
export interface Proof {
  value: string;
  label: string;
}

/** What you want next, said plainly, where it is read first. */
export interface OpenTo {
  roles: string[];
  markets: string[];
  note?: string;
}

export interface MenuItem {
  name: string;
  note: string;
  /** Right-hand column of the chalkboard — kept short, like a price. */
  price: string;
}

export const profile = {
  name: 'Costanzo Annichini',
  /**
   * The sign over the shop door.
   *
   * A person, not an invented company: there is no firm behind this, and
   * printing one on the fascia and across three products' packaging was set
   * dressing that stopped being charming the moment anyone read it.
   */
  shopName: 'COSTANZO ANNICHINI',
  /** Read in under three seconds, before anyone moves the mouse. */
  standfirst:
    'Sales professional, 23. Tech retail by trade, software by habit — everything on these shelves is something I built, sold, or both.',
  location: 'Portugal · Italy',
  languages: ['Italian (native)', 'Portuguese (native)', 'English'],

  /**
   * A recruiter's first two questions are "what are they after" and "can I
   * reach them". Both used to be behind a telephone you had to find and click.
   * The charm was costing conversions; this says it in the first screen and
   * the room still holds the detail.
   */
  openTo: {
    roles: ['Sales', 'Business development', 'Customer-facing tech'],
    markets: ['Portugal', 'Italy', 'Remote (EU)'],
  } satisfies OpenTo,

  /** Costanzo's own figures. Anything added here has to survive being asked about. */
  proof: [
    { value: '5', label: 'clubs onboarded' },
    { value: '3', label: 'analysts onboarded' },
    { value: '3', label: 'products built' },
  ] as Proof[],
};

export const contacts: ContactLink[] = [
  {
    // Deliberately not published: a personal address on a page a stranger can
    // scrape is a spam problem, not a contact method. LinkedIn is the door.
    id: 'email',
    label: 'Email',
    value: 'Available on request',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: '/in/costanzoannichini',
    // `www`, not the `it.` subdomain the profile is usually copied from:
    // `www` hands each visitor LinkedIn in their own language, and half the
    // people this page is aimed at are reading it in Portuguese.
    href: 'https://www.linkedin.com/in/costanzoannichini',
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

/**
 * The receipt is not a CV. It is a record of the visit: the projects the
 * visitor actually opened, printed as line items, with a short introduction
 * and a way to get in touch. Nothing here is information I would not hand to
 * a stranger who walked into the shop.
 */
export const receipt = {
  till: 'TILL 01',
  operator: 'C. ANNICHINI',
  /** The brief presentation, printed above the contacts. */
  pitch:
    'Twenty-three, selling in tech retail and building the software I wished the shop already had. Italian and Portuguese native. Looking for sales, business development and customer-facing work — or a good partner.',
  footer: 'PAID WITH YOUR ATTENTION',
  thanks: 'THANK YOU — COME BACK SOON',
  emptyBasket: 'NO ITEMS SCANNED YET',
  emptyHint: 'Open a product on the shelves and it prints here.',
};
