/**
 * The shelf inventory.
 *
 * Adding a project to the shop means adding one object to this array — the
 * shelves, lighting, price tags and mobile sections all derive from it, and
 * so does *where it stands*: position is reading order, and the fixture grows
 * to fit. See `data/shelving`.
 *
 * Reading order is deliberate and it is not chronology. The venture comes
 * first because the audience is hiring for sales, and the venture is where the
 * selling happened; the unpaid builds follow. Re-order the array and the room
 * re-orders itself.
 *
 * `shape` picks which SVG product component renders on the shelf. Reuse an
 * existing shape or add a new one to `components/shop/products`.
 */

export type ProjectStatus = 'in-stock' | 'out-of-stock' | 'restocking';

/**
 * Why a project exists, which is a different question from whether it shipped.
 *
 * Two of the three things on these shelves were built unpaid, on my own time,
 * because the problem was worth solving; one is a company with partner clubs
 * and people using it. A page that presents those identically makes a reader
 * guess, and a guess about a stranger is usually the unflattering one — either
 * "he calls a side project a company" or "he buried the company among demos".
 * `status` says whether a thing is finished. This says what the thing is.
 */
export type ProjectNature = 'venture' | 'portfolio';

export const natureLabel: Record<ProjectNature, string> = {
  venture: 'CO-FOUNDED VENTURE',
  portfolio: 'PORTFOLIO BUILD',
};

/** The same word, cut down for a price tag. */
export const natureShort: Record<ProjectNature, string> = {
  venture: 'VENTURE',
  portfolio: 'PORTFOLIO',
};

/** The same distinction in a full sentence, for the sheet and the index. */
export const natureNote: Record<ProjectNature, string> = {
  venture: 'A company: partner clubs, people using it, a market to sell to.',
  portfolio: 'Built unpaid, on my own time and my own brief — not a business.',
};

export type ProductShape = 'kiosk' | 'boxed-set' | 'crate' | 'tin' | 'carton';

/**
 * What the thing is made of. Drives the 3D material and, in the drawing, how
 * hard its highlight reads. Meaningful, not decorative: the unfinished project
 * ships in plain cardboard because it is not finished.
 */
export type ProductFinish = 'plastic' | 'clay' | 'rubber' | 'chrome' | 'card';

/** Which mark gets drawn on the packaging. */
export type BrandMark = 'suaipe' | 'kouci' | 'call-trainer';

/**
 * A number this project can back up.
 *
 * Figures belong to the project that earned them, never to a band under the
 * headline. A site-wide stat row is a sum: it goes stale the moment a fourth
 * project lands, it says nothing about which project did the work, and for a
 * shelf where most things were built for free it quietly implies a commercial
 * record that isn't there. Here, each number sits next to the thing it is
 * about, and a project with nothing honest to show simply has no `metrics`.
 *
 * Whatever goes in has to survive being asked "how do you know?" out loud.
 */
export interface ProjectMetric {
  value: string;
  label: string;
  /** One line saying exactly what the number counts, when that isn't obvious. */
  note?: string;
}

/**
 * A project's own identity.
 *
 * Three products sharing one muted palette read as three of the same thing.
 * Each one brings its real colours instead: Suaipe's blue, Kouci's sage and
 * white, and a mark invented for the trainer, which has none of its own yet.
 */
export interface Brand {
  /** The colour the product is moulded in. */
  base: string;
  /** Loud: the mark, the rules, the flash. */
  accent: string;
  /** Printed matter on the packaging. */
  paper: string;
  /** Type on that paper. */
  ink: string;
  mark: BrandMark;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  /** Stable id — also the anchor used by the text navigation. */
  id: string;
  name: string;
  /** One line, read at a glance on hover. */
  tagline: string;
  status: ProjectStatus;
  /** Company or unpaid build. Stated, never left to be inferred. */
  nature: ProjectNature;
  shape: ProductShape;
  brand: Brand;
  finish: ProductFinish;
  /** Price tag clipped to the shelf edge. Monospace, two short lines. */
  tag: { kind: string; year: string };
  /** Full description shown in the product sheet. */
  description: string;
  role: string;
  stack: string[];
  /** Left off entirely when there is no figure worth defending yet. */
  metrics?: ProjectMetric[];
  links: ProjectLink[];
}

export const projects: Project[] = [
  {
    id: 'kouci',
    name: 'Kouci',
    tagline: 'Sports-analytics SaaS for water polo',
    status: 'in-stock',
    nature: 'venture',
    shape: 'boxed-set',
    brand: {
      base: '#7d9166',
      accent: '#eef2e8',
      paper: '#f2f5ec',
      ink: '#151d11',
      mark: 'kouci',
    },
    finish: 'plastic',
    tag: { kind: 'SPORTS SAAS', year: '2025' },
    description:
      'A tactical and statistical analysis app for water polo: live match stats, penalty-shot mapping, roster management and animated tactics, built for coaches, clubs and federations.',
    role:
      'Co-founder — marketing, social media, outreach to clubs and federations, and partnerships.',
    stack: ['SaaS', 'Go-to-market', 'Partnerships'],
    metrics: [
      { value: '3', label: 'partner clubs', note: 'Signed as partners, not trials.' },
      { value: '3', label: 'analysts on board' },
    ],
    links: [
      { label: 'kouci.app', href: 'https://www.kouci.app/' },
      { label: 'Earlier build', href: 'https://kouci-web.vercel.app' },
    ],
  },
  {
    id: 'suaipe',
    name: 'Suaipe',
    tagline: 'In-store product discovery kiosk',
    status: 'in-stock',
    nature: 'portfolio',
    shape: 'kiosk',
    brand: {
      base: '#1c4fd0',
      accent: '#43a6ff',
      paper: '#eef4ff',
      ink: '#071231',
      mark: 'suaipe',
    },
    finish: 'plastic',
    tag: { kind: 'PWA KIOSK', year: '2025' },
    description:
      'An interactive iPad kiosk app built solo. An 8-question swipe quiz that recommends the best-fit product for a customer and generates a discount code in under 60 seconds. Includes an analytics dashboard with conversion funnel, multi-store product management, a 5-language interface, and production-grade security: bcrypt PIN, 2FA/TOTP, rate limiting and audit logging.',
    role: 'Solo — product, design and build.',
    stack: ['React 18', 'TypeScript', 'Supabase', 'Tailwind', 'Vercel'],
    metrics: [
      { value: '76%', label: 'usage conversion' },
      { value: '<60s', label: 'to a recommendation' },
      { value: '5', label: 'languages' },
    ],
    links: [
      { label: 'Live kiosk', href: 'https://suaipe.vercel.app' },
      { label: 'Source', href: 'https://github.com/ProgAnakin/Suaipe' },
    ],
  },
  {
    id: 'ai-call-trainer',
    name: 'AI Call Trainer',
    tagline: 'An AI simulator for cold calls',
    status: 'out-of-stock',
    nature: 'portfolio',
    shape: 'crate',
    brand: {
      base: '#c2632f',
      accent: '#ff9d3d',
      paper: '#f6ecdf',
      ink: '#2b1609',
      mark: 'call-trainer',
    },
    finish: 'card',
    tag: { kind: 'AI TRAINER', year: 'IN DEV' },
    description:
      'An AI simulator for cold calls. It runs realistic prospect scenarios and returns visual feedback on call structure, objection handling and recurring bad habits. Built to train sales fundamentals — the ones that are usually learned by burning real leads.',
    role: 'Solo — product and build.',
    stack: ['In development'],
    // No metrics on purpose: it is still being built, so there is nothing to count.
    links: [{ label: 'Source', href: 'https://github.com/ProgAnakin/AI-Call-Trainer' }],
  },
];

/** Small counts read better as words; past that, digits. */
const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

/**
 * The shelf in one sentence: "One co-founded venture, two builds of my own."
 *
 * This is the line that used to be a row of totals. It says the same thing the
 * totals were reaching for — there is real work here — without pretending the
 * shelf is uniform, and it is counted from the inventory, so the fourth
 * project rewrites it without anyone remembering to.
 */
export function shelfSummary(): string {
  const say = (n: number) => WORDS[n] ?? String(n);
  const ventures = projects.filter((project) => project.nature === 'venture').length;
  const builds = projects.length - ventures;

  const parts: string[] = [];
  if (ventures > 0) {
    parts.push(`${say(ventures)} co-founded ${ventures === 1 ? 'venture' : 'ventures'}`);
  }
  if (builds > 0) {
    parts.push(`${say(builds)} ${builds === 1 ? 'build' : 'builds'} of my own`);
  }
  if (parts.length === 0) return 'Restocking.';

  const line = parts.join(', ');
  return `${line[0].toUpperCase()}${line.slice(1)}.`;
}

/** Shelves are drawn from the inventory, so an empty shelf still gets a tag. */
export const SHELF_COUNT = 3;

export const statusLabel: Record<ProjectStatus, string> = {
  'in-stock': 'IN STOCK',
  'out-of-stock': 'OUT OF STOCK',
  restocking: 'RESTOCKING SOON',
};
