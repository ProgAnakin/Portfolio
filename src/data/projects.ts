/**
 * The shelf inventory.
 *
 * Adding a project to the shop means adding one object to this array — the
 * shelves, lighting, price tags and mobile sections all derive from it, and
 * so does *where it stands*: position is reading order, and the fixture grows
 * to fit. See `data/shelving`.
 *
 * `shape` picks which SVG product component renders on the shelf. Reuse an
 * existing shape or add a new one to `components/shop/products`.
 */

export type ProjectStatus = 'in-stock' | 'out-of-stock' | 'restocking';

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
  shape: ProductShape;
  brand: Brand;
  finish: ProductFinish;
  /** Price tag clipped to the shelf edge. Monospace, two short lines. */
  tag: { kind: string; year: string };
  /** Full description shown in the product sheet. */
  description: string;
  role: string;
  stack: string[];
  links: ProjectLink[];
}

export const projects: Project[] = [
  {
    id: 'suaipe',
    name: 'Suaipe',
    tagline: 'In-store product discovery kiosk',
    status: 'in-stock',
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
    links: [
      { label: 'Live kiosk', href: 'https://suaipe.vercel.app' },
      { label: 'Source', href: 'https://github.com/ProgAnakin/Suaipe' },
    ],
  },
  {
    id: 'kouci',
    name: 'Kouci',
    tagline: 'Sports-analytics SaaS for water polo',
    status: 'in-stock',
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
    links: [
      { label: 'kouci.app', href: 'https://www.kouci.app/' },
      { label: 'Earlier build', href: 'https://kouci-web.vercel.app' },
    ],
  },
  {
    id: 'ai-call-trainer',
    name: 'AI Call Trainer',
    tagline: 'An AI simulator for cold calls',
    status: 'out-of-stock',
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
    links: [{ label: 'Source', href: 'https://github.com/ProgAnakin/AI-Call-Trainer' }],
  },
];

/** Shelves are drawn from the inventory, so an empty shelf still gets a tag. */
export const SHELF_COUNT = 3;

export const statusLabel: Record<ProjectStatus, string> = {
  'in-stock': 'IN STOCK',
  'out-of-stock': 'OUT OF STOCK',
  restocking: 'RESTOCKING SOON',
};
