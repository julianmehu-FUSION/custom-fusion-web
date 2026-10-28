// The six featured apps. Read by the page (App.jsx) and by
// scripts/app-pages.mjs, which writes a page per app.

export const EMAIL = 'julian@customfusion.co';
export const ask = (app) => `mailto:${EMAIL}?subject=${encodeURIComponent(`${app} — early access`)}`;

// ── The six featured apps ──────────────────────────────────────────────────────
// `shots`: [{ src, kind: 'mac' | 'phone' | 'watch' }]. The first one replaces the
// big icon on the card (or `card`, if set); all of them show in the spotlight.
// `points`: three short lines for the spotlight.
export const APPS = [
  {
    id: 'falconer',
    name: 'Falconer',
    tagline: 'Your AI agents, one cockpit.',
    description: 'Run, track and steer your AI agents and projects from one place. Hand off work at the end of the day and pick up where your agents left off.',
    platforms: ['Mac', 'iPhone', 'Apple Watch'],
    accent: '#3fb6d9',
    icon: '/apps/falconer.png',
    status: 'Early access',
    cta: 'Request access',
    href: ask('Falconer'),
    shots: [
      { src: '/shots/falconer-1.webp', kind: 'mac' },
    ],
    points: [
      'Every project, task and agent run in one place.',
      'Hand work to your agents at the end of the day.',
      'Check in from your iPhone or Apple Watch.',
    ],
  },
  {
    id: 'dabom',
    name: 'daBOM',
    tagline: 'Parts, purchasing and stock in one place.',
    description: 'Bills of materials, purchase orders, receipts and inventory for a team that builds hardware. Built on a real production line, with a Copilot that does the paperwork.',
    platforms: ['Mac', 'Windows', 'iPad'],
    accent: '#3d8bff',
    icon: '/apps/dabom.png',
    status: 'Early access',
    cta: 'Request access',
    href: ask('daBOM'),
    shots: [
      { src: '/shots/dabom-1.webp', kind: 'mac' },
    ],
    points: [
      'BOMs, purchase orders, receipts and stock in one ledger.',
      'Card receipts become purchase orders on their own.',
      'A Copilot that drafts and files the paperwork.',
    ],
  },
  {
    id: 'artsuite',
    name: 'ArtSuite',
    tagline: 'Design, sculpt and render. One launcher.',
    description: 'Installs and updates our three design apps and keeps them current on its own.',
    platforms: ['Mac', 'Windows'],
    accent: '#ff5514',
    icon: '/apps/artsuite.png',
    status: 'Free · invite code',
    cta: 'Get ArtSuite',
    href: '/artsuite/',
    shots: [
      { src: '/shots/renderart-render.webp', kind: 'mac' },
      { src: '/shots/solidart-1.webp', kind: 'mac' },
      { src: '/shots/sculptart-1.webp', kind: 'mac' },
      { src: '/shots/renderart-1.webp', kind: 'mac' },
    ],
    points: [
      'SolidArt: parts, assemblies and drawings, STEP in and out.',
      'SculptArt: reliefs and molds, exported as tiles ready to cut.',
      'RenderArt: photoreal stills and turntables of what you design.',
    ],
    includes: [
      { name: 'SolidArt', what: 'CAD you build with AI', icon: '/apps/solidart.png' },
      { name: 'SculptArt', what: 'Sculpt for the CNC', icon: '/apps/sculptart.png' },
      { name: 'RenderArt', what: 'Photoreal renders', icon: '/apps/renderart.png' },
    ],
  },
  {
    id: 'watchagent',
    name: 'WatchAgent',
    tagline: 'AI on your wrist.',
    description: 'Ask a question on your Apple Watch and hear the answer in your AirPods. Hands-free, wherever you are.',
    platforms: ['Apple Watch', 'iPhone'],
    accent: '#ff6a00',
    icon: '/apps/watchagent.svg',
    status: 'Beta',
    cta: 'Join the beta',
    href: ask('WatchAgent'),
    shots: [
      { src: '/shots/watchagent-1.webp', kind: 'watch' },
    ],
    points: [
      'Raise your wrist and ask.',
      'The answer plays in your AirPods.',
      'Works anywhere your watch goes.',
    ],
  },
  {
    id: 'taskbandit',
    name: 'Task Bandit',
    tagline: 'Record the meeting. Get your tasks.',
    description: 'Set your phone on the table and tap Record. Afterwards you get a transcript, a summary and the tasks that are yours. It all happens on your iPhone.',
    platforms: ['iPhone', 'Apple Watch'],
    accent: '#c9c9c9',
    icon: '/apps/taskbandit.png',
    status: 'Beta',
    cta: 'Join the beta',
    href: ask('Task Bandit'),
    card: { src: '/shots/taskbandit-home.webp', kind: 'phone' },
    shots: [
      { src: '/shots/taskbandit-1.webp', kind: 'phone' },
      { src: '/shots/taskbandit-2.webp', kind: 'phone' },
    ],
    points: [
      'Keeps recording with the screen locked.',
      'Transcript, summary and the tasks that are yours.',
      'Stays on your iPhone unless you share it.',
    ],
  },
  {
    id: 'airreply',
    name: 'AirReply',
    tagline: 'Talk. Done.',
    description: 'One click in your menu bar and dictate into any app: chat, email, notes, AI assistants. Your words appear as you speak and land wherever your cursor is.',
    platforms: ['Mac', 'Apple Watch', 'iPhone'],
    accent: '#00c2ff',
    icon: '/apps/airreply.png',
    status: 'Free download',
    cta: 'Download free',
    href: '/airreply/',
    shots: [
      { src: '/shots/airreply-1.webp', kind: 'mac' },
      { src: '/shots/airreply-watch.webp', kind: 'watch' },
    ],
    points: [
      'Works in any app with a text field.',
      'Your words appear live as you speak.',
      'Dictate from your Apple Watch or iPhone too.',
    ],
  },
];
