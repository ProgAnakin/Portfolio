import caderninhoLogo from '../assets/logos/caderninho.svg';
import kouciLogo from '../assets/logos/kouci.webp';
import trainerLogo from '../assets/logos/ai-call-trainer.svg';
import suaipeLogo from '../assets/logos/suaipe.webp';

/**
 * The work.
 *
 * Adding a project means adding one object here; its media is whatever sits in
 * `assets/shots/<id>/` (see `data/media`). Order is reading order, and it is
 * deliberate: the product that is for sale first, then the company, then the
 * two builds that exist to learn.
 */

/**
 * Why a project exists — stated, never left to be inferred.
 *
 * One is a product I intend to sell, one is a company I co-founded and that
 * has no revenue yet, two were built unpaid on my own brief. A page that
 * presents those identically makes a reader guess, and a guess about a
 * stranger is usually the unflattering one.
 */
export type ProjectNature = 'product' | 'venture' | 'portfolio';

export const natureLabel: Record<ProjectNature, string> = {
  product: 'Product',
  venture: 'Co-founded venture',
  portfolio: 'Portfolio build',
};

/**
 * A number this project can back up. Whatever goes in has to survive being
 * asked "how do you know?" out loud; a project with nothing honest to count
 * simply has no `metrics`.
 */
export interface ProjectMetric {
  value: string;
  label: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  /** Stable id: the anchor, and the media folder's name. */
  id: string;
  name: string;
  /** One line, read at a glance. */
  tagline: string;
  nature: ProjectNature;
  /** Where it stands today, in a few words. */
  status: string;
  year: string;
  logo: string;
  /** The brand's own colour — used only once the project has been opened. */
  accent: string;
  /** The situation that made it worth doing. */
  problem: string;
  /** What it does. */
  solution: string;
  /** What I did on it. */
  role: string;
  /** What came of it. Absent while there is nothing honest to say. */
  outcome?: string;
  metrics?: ProjectMetric[];
  stack: string[];
  links: ProjectLink[];
}

export const projects: Project[] = [
  {
    id: 'caderninho',
    name: 'Caderninho Digital',
    tagline: 'A CRM for the shop counter',
    nature: 'product',
    status: 'Built — looking for its first shops',
    year: '2026',
    logo: caderninhoLogo,
    accent: '#2457e6',
    problem:
      'Shops that repair, order and follow up keep their customers in a notebook by the till — the caderninho. A part arrives and nobody calls. A repair is ready and the client is never told. Someone says “I’ll think about it” and is never heard from again.',
    solution:
      'Every customer waiting on a part, a repair, an answer or the fix for a complaint becomes a case. The app puts what needs attention first, reminds the team at the right moment and has the WhatsApp message ready in the client’s own language. It runs on the iPad at the counter, the shop’s Mac and the team’s phones, across several stores, with roles.',
    role: 'Solo — product, design and build. Now the part I do for a living: selling it.',
    outcome:
      'Finished and tested; priced as a monthly subscription per store. The salesperson who wanted a better follow-up tool built one, and is now taking it to the shops that need it.',
    metrics: [
      { value: '4', label: 'languages, for staff and clients' },
      { value: '549', label: 'automated checks' },
      { value: '0.7s', label: 'to open 1,500 cases on a slow phone' },
    ],
    stack: ['React', 'TypeScript', 'Supabase · Postgres', 'Installable web app', 'Web Push'],
    links: [{ label: 'Product page and tour', href: 'https://github.com/ProgAnakin/TACC' }],
  },
  {
    id: 'kouci',
    name: 'Kouci',
    tagline: 'Sports analytics for water polo',
    nature: 'venture',
    status: 'Pre-revenue — pilot with Vitória SC',
    year: '2025',
    logo: kouciLogo,
    accent: '#7d9166',
    problem:
      'Football and basketball clubs have analytics software to choose from. Water polo has whiteboards, phone video and whatever the coach remembers of the second quarter.',
    solution:
      'A tactical and statistical app for water polo: live match stats, penalty-shot mapping, roster management and animated tactics, for coaches, clubs and federations.',
    role: 'Co-founder — go-to-market: positioning, social media, outreach to clubs and federations, partnerships.',
    // Pre-revenue, and said so. There are no signed clubs: one runs an unpaid
    // pilot. A co-founder who claims customers he does not have is found out
    // in the first reference call.
    outcome:
      'Still being built, with no revenue and no contracts yet. Vitória Sport Clube, in Guimarães, runs an unpaid pilot with its water-polo squad, so the ideas are tested against a real team before there is anything to sell. My half is the going-out-and-finding-them half.',
    stack: ['SaaS', 'Go-to-market', 'Partnerships'],
    links: [
      { label: 'kouci.app', href: 'https://www.kouci.app/' },
      { label: 'Earlier build', href: 'https://kouci-web.vercel.app' },
    ],
  },
  {
    id: 'ai-call-trainer',
    name: 'AI Call Trainer',
    tagline: 'Cold-call practice against an AI prospect',
    nature: 'portfolio',
    status: 'Live — free and open source',
    year: '2026',
    logo: trainerLogo,
    accent: '#5b5bf0',
    problem:
      'Cold calling is learned by doing it badly on real prospects. The feedback is a burnt lead and somebody’s memory of how the call went — the most expensive training material there is.',
    solution:
      'Pick a scenario and hold a cold or discovery call with an AI prospect who has their own pains, hidden objections and mood. Hang up and get a scorecard: a score per criterion, talk ratio, questions asked, an objection-by-objection map and one thing to fix next time. A rapid-fire objection drill keeps serving the objections you handle worst.',
    role: 'Solo — product and build. Written from the seller’s side of the call.',
    metrics: [
      { value: '4', label: 'call languages' },
      { value: '7', label: 'objective metrics per call' },
    ],
    stack: ['React', 'TypeScript', 'Claude API', 'Web Speech', 'Supabase'],
    links: [{ label: 'Source', href: 'https://github.com/ProgAnakin/AI-Call-Trainer' }],
  },
  {
    id: 'suaipe',
    name: 'Suaipe',
    tagline: 'An in-store product discovery kiosk',
    nature: 'portfolio',
    status: 'Live demo',
    year: '2025',
    logo: suaipeLogo,
    accent: '#1c4fd0',
    problem:
      'On a shop floor the same eight questions get asked all day, and the answer is only as good as whoever happens to be free. A customer who cannot decide leaves to think about it, and mostly does not come back.',
    solution:
      'An iPad kiosk: eight swipes and the customer has a recommendation and a discount code, without needing anyone. Behind it, a dashboard with the conversion funnel and multi-store catalogue, and production-grade security — hashed PINs, two-factor sign-in, rate limiting, audit logs.',
    role: 'Solo — product, design and build.',
    metrics: [
      { value: '76%', label: 'usage conversion' },
      { value: '<60s', label: 'to a recommendation' },
      { value: '5', label: 'languages' },
    ],
    stack: ['React', 'TypeScript', 'Supabase', 'Tailwind', 'Vercel'],
    links: [
      { label: 'Live kiosk', href: 'https://suaipe.vercel.app' },
      { label: 'Source', href: 'https://github.com/ProgAnakin/Suaipe' },
    ],
  },
];
