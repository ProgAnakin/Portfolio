/**
 * The shelf inventory.
 *
 * Adding a project to the shop means adding one object to this array — the
 * shelves, lighting, price tags and mobile sections all derive from it.
 *
 * `shape` picks which SVG product component renders on the shelf. Reuse an
 * existing shape or add a new one to `components/shop/products`.
 */

export type ProjectStatus = 'in-stock' | 'out-of-stock' | 'restocking';

export type ProductShape = 'kiosk' | 'boxed-set' | 'crate' | 'tin' | 'carton';

export type ProductTint =
  | 'sage'
  | 'clay'
  | 'slate'
  | 'mustard'
  | 'plum';

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
  /** Which shelf (0 = top) and where along it the product sits. */
  shelf: number;
  slot: number;
  shape: ProductShape;
  tint: ProductTint;
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
    shelf: 0,
    slot: 0,
    shape: 'kiosk',
    tint: 'slate',
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
    shelf: 0,
    slot: 1,
    shape: 'boxed-set',
    tint: 'sage',
    tag: { kind: 'SPORTS SAAS', year: '2025' },
    description:
      'A tactical and statistical analysis app for water polo: live match stats, penalty-shot mapping, roster management and animated tactics, built for coaches, clubs and federations.',
    role:
      'Co-founder — marketing, social media, outreach to clubs and federations, and partnerships.',
    stack: ['SaaS', 'Go-to-market', 'Partnerships'],
    links: [{ label: 'Live app', href: 'https://kouci-web.vercel.app' }],
  },
  {
    id: 'sales-call-trainer',
    name: 'Sales Call Trainer',
    tagline: 'An AI simulator for cold calls',
    status: 'out-of-stock',
    shelf: 1,
    slot: 0,
    shape: 'crate',
    tint: 'clay',
    tag: { kind: 'AI TRAINER', year: 'IN DEV' },
    description:
      'An AI simulator for cold calls. It runs realistic prospect scenarios and returns visual feedback on call structure, objection handling and recurring bad habits. Built to train sales fundamentals — the ones that are usually learned by burning real leads.',
    role: 'Solo — product and build.',
    stack: ['In development'],
    links: [],
  },
];

/** Shelves are drawn from the inventory, so an empty shelf still gets a tag. */
export const SHELF_COUNT = 3;

export const statusLabel: Record<ProjectStatus, string> = {
  'in-stock': 'IN STOCK',
  'out-of-stock': 'OUT OF STOCK',
  restocking: 'RESTOCKING SOON',
};
