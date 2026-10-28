import React, { Suspense, lazy, useEffect, useState } from 'react';
import './App.css';
import { APPS, EMAIL } from './apps';

// The 3D logo loads after the text so the page shows up fast on phones.
const HeroLogo = lazy(() => import('./HeroLogo'));


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
      <a href={`/${app.id}/`} className="app-media" aria-label={`More about ${app.name}`}>
        <div className="app-media-glow" />
        {app.shots.length
          ? <Shot shot={app.card || app.shots[0]} name={app.name} peek />
          : <img src={app.icon} alt="" className="app-media-icon" loading="lazy" />}
      </a>
      <div className="app-body">
        <div className="app-head">
          <img src={app.icon} alt={`${app.name} icon`} className="app-icon" loading="lazy" />
          <div>
            <h3 className="app-name"><a href={`/${app.id}/`}>{app.name}</a></h3>
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
          <a href={`/${app.id}/`} className="app-more">Details →</a>
        </div>
        <ul className="app-platforms">
          <li className="app-status">{app.status}</li>
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
