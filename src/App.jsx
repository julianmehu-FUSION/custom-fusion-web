import React, { Suspense, lazy, useEffect, useState } from 'react';
import './App.css';

// The 3D logo loads after the text so the page shows up fast on phones.
const HeroLogo = lazy(() => import('./HeroLogo'));

const EMAIL = 'julian@customfusion.co';
const ask = (app) => `mailto:${EMAIL}?subject=${encodeURIComponent(`${app} — early access`)}`;

function AnimatedWord({ text, baseDelay, isAccent }) {
  return (
    <span className={`word ${isAccent ? 'accent-word' : ''}`}>
      {text.split('').map((char, i) => (
        <span key={i} className="letter" style={{ animationDelay: `${baseDelay + i * 0.04}s` }}>
          {char}
        </span>
      ))}
    </span>
  );
}

// ── The six featured apps ──────────────────────────────────────────────────────
// `shots`: [{ src, kind: 'mac' | 'phone' | 'watch' }]. The first one replaces the
// big icon on the card (or `card`, if set); all of them show in the spotlight.
// `points`: three short lines for the spotlight.
const APPS = [
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

// A screenshot in a device frame. Mac shots are already a window, so they only
// get a shadow; phone and watch shots get a CSS bezel.
function Shot({ shot, name, peek }) {
  return (
    <div className={`shot shot-${shot.kind}${peek ? ' shot-peek' : ''}`}>
      <img src={shot.src} alt={`${name} screenshot`} loading="lazy" />
    </div>
  );
}

function Spotlight({ app, flip }) {
  return (
    <div className={`spotlight${flip ? ' flip' : ''}`} style={{ '--accent': app.accent }}>
      <div className={`spot-media${app.shots.length > 2 ? ' spot-grid' : ''}`}>
        <div className="app-media-glow" />
        {app.shots.map((shot) => <Shot key={shot.src} shot={shot} name={app.name} />)}
      </div>
      <div className="spot-text">
        <div className="app-head">
          <img src={app.icon} alt="" className="app-icon" loading="lazy" />
          <div>
            <h3 className="app-name">{app.name}</h3>
            <p className="app-tagline">{app.tagline}</p>
          </div>
        </div>
        <ul className="spot-points">
          {app.points.map((p) => <li key={p}>{p}</li>)}
        </ul>
        <a href={app.href} className="app-cta">{app.cta}</a>
      </div>
    </div>
  );
}

function AppCard({ app }) {
  return (
    <article id={app.id} className="app-card" style={{ '--accent': app.accent }}>
      <div className="app-media">
        <div className="app-media-glow" />
        {app.shots.length
          ? <Shot shot={app.card || app.shots[0]} name={app.name} peek />
          : <img src={app.icon} alt="" className="app-media-icon" loading="lazy" />}
      </div>
      <div className="app-body">
        <div className="app-head">
          <img src={app.icon} alt={`${app.name} icon`} className="app-icon" loading="lazy" />
          <div>
            <h3 className="app-name">{app.name}</h3>
            <p className="app-tagline">{app.tagline}</p>
          </div>
        </div>
        <p className="app-description">{app.description}</p>
        {app.includes && (
          <ul className="app-includes">
            {app.includes.map((sub) => (
              <li key={sub.name}>
                <img src={sub.icon} alt="" loading="lazy" />
                <span><b>{sub.name}</b>{sub.what}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="app-foot">
          <a href={app.href} className="app-cta">{app.cta}</a>
          <span className="app-status">{app.status}</span>
        </div>
        <ul className="app-platforms">
          {app.platforms.map((p) => <li key={p}>{p}</li>)}
        </ul>
      </div>
    </article>
  );
}

function App() {
  const [loaded, setLoaded] = useState(false);
  const [particles] = useState(() => Array.from({ length: 30 }, () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${1 + Math.random() * 2}px`,
    duration: `${8 + Math.random() * 15}s`,
    delay: `${Math.random() * 10}s`,
    opacity: 0.1 + Math.random() * 0.3,
  })));

  useEffect(() => {
    document.fonts.ready.then(() => setLoaded(true));
  }, []);

  return (
    <div className={`app-container ${loaded ? 'loaded' : ''}`}>

      {/* ── Navbar ── */}
      <nav className="navbar">
        <a href="#top" className="logo">
          <img src="/logo.png" alt="" />
          Custom&nbsp;<span>Fusion</span>
        </a>
        <ul className="nav-links">
          <li><a href="#apps">Apps</a></li>
          <li><a href="#why-free">Why free</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <a href="#apps" className="nav-cta">Get the apps</a>
      </nav>

      {/* ── Hero ── */}
      <header id="top" className="hero">
        <div className="hero-particles">
          {particles.map((p, i) => (
            <div key={i} className="particle" style={{
              left: p.left, top: p.top, width: p.size, height: p.size,
              animationDuration: p.duration, animationDelay: p.delay, opacity: p.opacity,
            }} />
          ))}
        </div>
        <div className="hero-content">
          <div className="hero-eyebrow">Custom Fusion · Free apps</div>
          <h1 className="hero-headline">
            <AnimatedWord text="Built" baseDelay={0.2} />
            {' '}
            <AnimatedWord text="for" baseDelay={0.45} />
            {' '}
            <AnimatedWord text="us." baseDelay={0.6} />
            <br />
            <AnimatedWord text="Free" baseDelay={1.0} isAccent />
            {' '}
            <AnimatedWord text="for" baseDelay={1.25} />
            {' '}
            <AnimatedWord text="you." baseDelay={1.4} />
          </h1>
          <p className="hero-tagline">
            Six apps we made to run our own studio: AI agents, hardware purchasing, 3D design, meetings and dictation. Now free for everyone.
          </p>
          <div className="hero-ctas">
            <a href="#apps" className="cta-button">Get the apps</a>
            <a href="#why-free" className="cta-link">Why free →</a>
          </div>
        </div>
        <div className="hero-visual">
          <Suspense fallback={null}><HeroLogo /></Suspense>
        </div>
      </header>

      {/* ── App dock: one row of icons that jumps to each card ── */}
      <nav className="app-dock" aria-label="Apps">
        {APPS.map((app) => (
          <a key={app.id} href={`#${app.id}`} className="dock-item">
            <img src={app.icon} alt="" />
            <span>{app.name}</span>
          </a>
        ))}
      </nav>

      {/* ── Apps ── */}
      <section id="apps" className="apps-section">
        <div className="section-header">
          <h2>The Apps</h2>
          <p className="section-sub">Made from real frustration. Used every day.</p>
        </div>
        <div className="apps-grid">
          {APPS.map((app) => <AppCard key={app.id} app={app} />)}
        </div>
      </section>

      {/* ── A closer look: one section per app that has screenshots ── */}
      {APPS.some((a) => a.shots.length > 0) && (
        <section id="closer-look" className="spotlights">
          <div className="section-header">
            <h2>A Closer Look</h2>
            <p className="section-sub">Real apps, shown with sample data.</p>
          </div>
          {APPS.filter((a) => a.shots.length > 0).map((app, i) => (
            <Spotlight key={app.id} app={app} flip={i % 2 === 1} />
          ))}
        </section>
      )}

      {/* ── Why free ── */}
      <section id="why-free" className="why-free">
        <div className="why-inner">
          <div className="why-label">Why free</div>
          <blockquote className="why-quote">
            We built these for ourselves.<br />
            They're too useful to <span className="accent">keep to ourselves.</span>
          </blockquote>
          <div className="why-points">
            <div>
              <b>No catch</b>
              <p>No subscription, no ads. The apps that use AI run on your own Claude or ChatGPT account, or on your device.</p>
            </div>
            <div>
              <b>Still improving</b>
              <p>We use these every day, so they keep getting better. Updates install with one click.</p>
            </div>
            <div>
              <b>All we ask</b>
              <p>Tell us what breaks, and tell a friend if one saves you time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="contact">
        <div className="contact-content">
          <h2>Say Hello</h2>
          <p className="contact-description">
            Found a bug, want early access, or have an idea for the next one? Write to us.
          </p>
          <a href={`mailto:${EMAIL}`} className="contact-email">{EMAIL}</a>
        </div>
      </section>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Custom Fusion Inc. · New York</p>
        <p><a href="/airreply/privacy/">Privacy</a></p>
      </footer>

    </div>
  );
}

export default App;
