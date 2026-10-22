import caderninhoLogo from '../assets/logos/caderninho.svg';
import kouciLogo from '../assets/logos/kouci.webp';
import trainerLogo from '../assets/logos/ai-call-trainer.svg';
import suaipeLogo from '../assets/logos/suaipe.webp';
import caderninhoPreview from '../assets/previews/caderninho.mp4';
import caderninhoPreviewWebm from '../assets/previews/caderninho.webm';
import caderninhoPreviewPoster from '../assets/previews/caderninho.webp';
import suaipePreview from '../assets/previews/suaipe.mp4';
import suaipePreviewWebm from '../assets/previews/suaipe.webm';
import suaipePreviewPoster from '../assets/previews/suaipe.webp';
import trainerPreview from '../assets/previews/ai-call-trainer.mp4';
import trainerPreviewWebm from '../assets/previews/ai-call-trainer.webm';
import trainerPreviewPoster from '../assets/previews/ai-call-trainer.webp';

/**
 * The work.
 *
 * Adding a project means adding one object here; its case media is whatever
 * sits in `assets/shots/<id>/` (see `data/media`). Order is reading order: the
 * product that is for sale first, then the two builds that ran or run for
 * real users, then the company.
 */

/** Why a project exists, stated rather than left to be inferred. */
export type ProjectNature = 'product' | 'venture' | 'portfolio';

export const natureLabel: Record<ProjectNature, string> = {
  product: 'Product',
  venture: 'Co-founded start-up',
  portfolio: 'Built unpaid',
};

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

/** A point in the case video, so a reader can jump to the part they want. */
export interface Chapter {
  at: number;
  label: string;
}

export interface Project {
  /** Stable id: the anchor, and the media folder's name. */
  id: string;
  name: string;
  tagline: string;
  nature: ProjectNature;
  status: string;
  year: string;
  logo: string;
  /** The brand's own colour, used once the case is open. */
  accent: string;
  /** A short silent loop for the card. */
  preview?: {
    /** mp4, then webm. */
    video: [string, string];
    poster: string;
    fit: 'cover' | 'contain';
    /** The panel behind a contained video, matched to the video's own edges. */
    background?: string;
  };
  /** One or two sentences on the card. */
  summary: string;
  /** Why it exists. */
  context: string;
  /** How it works, step by step. For the company, what my part is. */
  steps: { title: string; items: string[] };
  /** Where it stands today. */
  outcome: string;
  role: string;
  metrics?: ProjectMetric[];
  /** For the case video, the first clip in the media folder. */
  chapters?: Chapter[];
  /** Said under the video: how it was recorded. */
  videoNote?: string;
  stack: string[];
  links: ProjectLink[];
}

export const projects: Project[] = [
  {
    id: 'caderninho',
    name: 'Caderninho Digital',
    tagline: 'A CRM for the shop counter',
    nature: 'product',
    status: 'Looking for its first shops',
    year: '2026',
    logo: caderninhoLogo,
    accent: '#2457e6',
    preview: {
      video: [caderninhoPreview, caderninhoPreviewWebm],
      poster: caderninhoPreviewPoster,
      fit: 'contain',
      background: '#e8e7f6',
    },
    summary:
      'Shops that repair, order and follow up still keep their customers in a paper notebook. This replaces it with cases, reminders and a WhatsApp message ready to send.',
    context:
      'In a shop, a lot of sales depend on calling the customer back: the part has arrived, the repair is ready, the product they asked about is in. Most shops keep that in a notebook by the till, the caderninho, and a notebook doesn’t remind anyone. I built the tool I’d want at the counter, and now I’m selling it.',
    steps: {
      title: 'How it works',
      items: [
        'A customer waiting on something becomes a case: an order, a repair, a lead or a complaint.',
        'The app plans the follow-ups and puts what needs attention at the top, with the reason.',
        'When it’s time, the WhatsApp message is already written, in the customer’s language.',
        'The case closes with the outcome, and a check-in is booked for seven days later.',
      ],
    },
    outcome:
      'Finished and tested. Priced as a monthly subscription per store, for shops with one counter or several.',
    role: 'All of it: product, design and code. Now the selling.',
    metrics: [
      { value: '4', label: 'languages: Italian, Portuguese, Spanish, English' },
      { value: '549', label: 'automated checks on every change' },
      { value: '0.7 s', label: 'to open 1,500 cases on a slow phone' },
    ],
    chapters: [
      { at: 0, label: 'Intro' },
      { at: 3, label: 'What needs you today' },
      { at: 12, label: 'A new case' },
      { at: 21, label: 'Swipe to close' },
      { at: 27, label: 'Reminders on the iPad' },
      { at: 36, label: 'The shop in numbers' },
      { at: 45, label: 'Under the hood' },
    ],
    videoNote: 'The product tour, with demo data.',
    stack: ['React', 'TypeScript', 'Supabase and Postgres', 'Installable web app', 'Web Push'],
    links: [
      { label: 'Product page and tour on GitHub', href: 'https://github.com/ProgAnakin/TACC' },
    ],
  },
  {
    id: 'suaipe',
    name: 'Suaipe',
    tagline: 'A product finder for the shop floor',
    nature: 'portfolio',
    status: 'Used on iPads in store',
    year: '2025',
    logo: suaipeLogo,
    accent: '#1c4fd0',
    preview: {
      video: [suaipePreview, suaipePreviewWebm],
      poster: suaipePreviewPoster,
      fit: 'contain',
    },
    summary:
      'An iPad kiosk that asks eight yes-or-no questions, recommends one product and emails the customer a discount code.',
    context:
      'On a busy day there are more customers than staff. Someone who can’t get help, or can’t decide, often leaves to think about it. Suaipe gives them a quick way to narrow the choice on their own, and gives the shop a contact and a reason for them to come back.',
    steps: {
      title: 'How it works',
      items: [
        'The kiosk shows an attract screen until someone taps it.',
        'The customer enters a name and email and picks one of five languages.',
        'Eight questions, answered with a swipe or a tap.',
        'One recommended product, with the price, a video, the manual and a personal discount code by email.',
        'Managers see the sessions, the conversion funnel and each store’s catalogue.',
      ],
    },
    outcome: 'Built unpaid, on my own time, and used on iPads in store.',
    role: 'On my own: product, design and code.',
    metrics: [
      { value: '76%', label: 'usage conversion' },
      { value: '<60 s', label: 'from first tap to a recommendation' },
      { value: '5', label: 'languages' },
    ],
    chapters: [
      { at: 0, label: 'Attract screen' },
      { at: 6, label: 'Customer signs in' },
      { at: 10, label: 'How to swipe' },
      { at: 12, label: 'Eight questions' },
      { at: 26, label: 'The match' },
    ],
    videoNote:
      'Recorded from the real app with demo data. The catalogue and questions are in Italian, as in store.',
    stack: ['React', 'TypeScript', 'Supabase', 'Tailwind', 'Vercel'],
    links: [
      { label: 'Live kiosk', href: 'https://suaipe.vercel.app' },
      { label: 'Source on GitHub', href: 'https://github.com/ProgAnakin/Suaipe' },
    ],
  },
  {
    id: 'ai-call-trainer',
    name: 'AI Call Trainer',
    tagline: 'Cold-call practice against an AI prospect',
    nature: 'portfolio',
    status: 'Live, free and open source',
    year: '2026',
    logo: trainerLogo,
    accent: '#5b5bf0',
    preview: {
      video: [trainerPreview, trainerPreviewWebm],
      poster: trainerPreviewPoster,
      fit: 'cover',
    },
    summary:
      'Practise a cold call with an AI prospect who has their own objections and mood, then get a scorecard on what you said.',
    context:
      'New SDRs learn cold calling on real prospects, and every bad call costs a lead. Roleplay with a manager helps, but nobody has time for it every day. I wanted somewhere to practise as often as I like, in Italian, Portuguese or English, with honest feedback straight after the call.',
    steps: {
      title: 'How it works',
      items: [
        'Pick a scenario: who picks up, what you’re selling, the call type and the difficulty.',
        'Read the briefing: the prospect’s personality, their mood and your goal for the call.',
        'Make the call by voice or by text. The prospect pushes back the way real people do.',
        'Hang up and get the scorecard: talk ratio, questions asked, whether you set a next step, a score per criterion and one thing to fix.',
        'Drill objections on their own. The ones you handle worst come back more often.',
      ],
    },
    outcome: 'Live, free and open source.',
    role: 'On my own: product and code, written from the seller’s side of the call.',
    metrics: [
      { value: '4', label: 'call languages' },
      { value: '7', label: 'objective measures per call' },
    ],
    chapters: [
      { at: 0, label: 'Pick a scenario' },
      { at: 3, label: 'The briefing' },
      { at: 6, label: 'The call, in Italian' },
      { at: 36, label: 'Scoring' },
      { at: 39, label: 'The scorecard' },
    ],
    videoNote:
      'Recorded in demo mode, where the prospect is simulated without the AI. My lines are typed live.',
    stack: ['React', 'TypeScript', 'Claude API', 'Web Speech', 'Supabase'],
    links: [{ label: 'Source on GitHub', href: 'https://github.com/ProgAnakin/AI-Call-Trainer' }],
  },
  {
    id: 'kouci',
    name: 'Kouci',
    tagline: 'Match analysis for water polo',
    nature: 'venture',
    status: 'Pre-revenue, pilot with Vitória SC',
    year: '2025',
    logo: kouciLogo,
    accent: '#7d9166',
    summary:
      'A start-up I co-founded: statistics and tactics software for water polo clubs, now in a pilot with Vitória Sport Clube.',
    context:
      'Football and basketball have plenty of analysis software. Water polo coaches mostly work from a whiteboard, phone videos and memory. Kouci gives them live match statistics, a penalty-shot map, roster management and animated tactics.',
    steps: {
      title: 'My part',
      items: [
        'Positioning: who it’s for, and why a club would pay for it.',
        'Outreach to clubs and federations.',
        'Partnerships, starting with the pilot at Vitória SC.',
        'Social media.',
      ],
    },
    // Pre-revenue, and said so. There are no signed clubs: one runs an unpaid
    // pilot. A co-founder who claims customers he does not have is found out
    // in the first reference call.
    outcome:
      'No revenue and no contracts yet. Vitória Sport Clube, in Guimarães, runs an unpaid pilot with its water polo team, so we test against a real squad before there’s anything to sell.',
    role: 'Co-founder, responsible for going to market.',
    stack: ['SaaS', 'Go-to-market', 'Partnerships'],
    links: [
      { label: 'kouci.app', href: 'https://www.kouci.app/' },
      { label: 'Earlier build', href: 'https://kouci-web.vercel.app' },
    ],
  },
];
