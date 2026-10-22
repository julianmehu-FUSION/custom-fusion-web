import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import DodecahedronLogo from './DodecahedronLogo';
import './App.css';

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

// ── App cards ─────────────────────────────────────────────────────────────────
const APPS = [
  {
    name: 'AirReply',
    tagline: 'Talk. Done.',
    description: 'One click in your menu bar to dictate into any app — chat, email, notes, AI assistants. Your words appear live as you speak, then land wherever your cursor is.',
    status: 'Free Download',
    statusType: 'available',
    platform: 'macOS 26',
    accent: '#00c2ff',
    bg: 'linear-gradient(135deg, #001520 0%, #002535 60%, #111 100%)',
    iconImg: '/apps/airreply.png',
    detail: 'Uses Apple speech recognition. Optional spoken replies keep the conversation hands-free.',
    href: '/airreply/',
    cta: 'Download free →',
  },
  {
    name: 'SolidArt',
    tagline: 'CAD you build with AI.',
    description: 'Parametric CAD for Mac: parts, assemblies, drawings and design checks, with a Copilot and an agent interface that design alongside you.',
    status: 'Coming Soon',
    statusType: 'soon',
    platform: 'macOS 14+',
    accent: '#ff5514',
    bg: 'linear-gradient(135deg, #200800 0%, #351000 60%, #111 100%)',
    iconImg: '/apps/solidart.png',
    detail: 'OpenCASCADE kernel. Imports STEP, STL and Rhino; exports STEP, STL, PDF, SVG and DXF.',
  },
  {
    name: 'SculptArt',
    tagline: 'Sculpt for the CNC.',
    description: 'Sculpt reliefs, molds and bucks by hand or with AI, then check tool reach and export tiles ready to cut.',
    status: 'Coming Soon',
    statusType: 'soon',
    platform: 'macOS 14+',
    accent: '#e1d7c3',
    bg: 'linear-gradient(135deg, #1a150d 0%, #2a2216 60%, #111 100%)',
    iconImg: '/apps/sculptart.png',
    detail: 'Every stroke is a replayable step. Exports STL, OBJ, heightmaps and rib patterns.',
  },
  {
    name: 'RenderArt',
    tagline: 'Render what you design.',
    description: 'Photoreal stills, turntables and animations of your parts and assemblies, lit with HDRIs on a Metal path tracer, set up by hand or by AI.',
    status: 'Coming Soon',
    statusType: 'soon',
    platform: 'macOS 14+',
    accent: '#8ad7ff',
    bg: 'linear-gradient(135deg, #061018 0%, #0c1f2e 60%, #111 100%)',
    iconImg: '/apps/renderart.png',
    detail: 'Reads USD, OBJ and STL. Exports PNG stills, image sequences and MP4 turntables.',
  },
  {
    name: 'Falconer',
    tagline: 'Your AI agents, one cockpit.',
    description: 'Run, track and steer your AI agents and projects from one place — on your Mac, iPhone and Apple Watch.',
    status: 'Coming Soon',
    statusType: 'soon',
    platform: 'macOS · iPhone · Apple Watch',
    accent: '#3fb6d9',
    bg: 'linear-gradient(135deg, #00101f 0%, #0b2340 60%, #111 100%)',
    iconImg: '/apps/falconer.png',
    detail: 'Hand off work at the end of the day; pick up where your agents left off.',
  },
  {
    name: 'Watch Assist AI',
    tagline: 'AI on your wrist.',
    description: 'Speak a question on your Apple Watch. Hear the answer through your AirPods. Hands-free, wherever you are.',
    status: 'Coming Soon',
    statusType: 'soon',
    platform: 'Apple Watch · iPhone',
    accent: '#ff6a00',
    bg: 'linear-gradient(135deg, #1a0f00 0%, #2a1500 60%, #111 100%)',
    icon: '⌚',
    detail: 'Voice in, spoken answer out. Works anywhere your watch goes.',
  },
  {
    name: 'Neopix',
    tagline: 'Your lights. Your rules.',
    description: 'BLE LED control from your iPhone — any strip, any colour, any rhythm. The lighting app that actually works with the hardware you already own.',
    status: 'Coming Soon',
    statusType: 'soon',
    platform: 'iPhone',
    accent: '#7b2fff',
    bg: 'linear-gradient(135deg, #0d0020 0%, #1a0035 60%, #111 100%)',
    icon: '💡',
    detail: 'Supports NeoPixels, ELK-BLEDOM, Triones and more.',
  },
];

const TOOLS = [
  { name: 'Ableton', category: 'Music Production' },
  { name: 'Keyshot', category: '3D Rendering' },
  { name: 'Rhino', category: 'CAD · 3D Modelling' },
  { name: 'Blender', category: '3D · Animation' },
  { name: 'Claude Code', category: 'AI Development' },
  { name: 'Xcode', category: 'iOS · watchOS' },
];

function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => setLoaded(true));
  }, []);

  return (
    <div className={`app-container ${loaded ? 'loaded' : ''}`}>

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="logo">
          <img src="/logo.png" alt="Custom Fusion" style={{ width: '36px', marginRight: '12px' }} />
          Custom&nbsp;<span>Fusion</span>
        </div>
        <ul className="nav-links">
          <li><a href="#apps">Apps</a></li>
          <li><a href="#platform">Platform</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* ── Hero ── */}
      <header className="hero">
        <div className="hero-particles">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              animationDuration: `${8 + Math.random() * 15}s`,
              animationDelay: `${Math.random() * 10}s`,
              opacity: 0.1 + Math.random() * 0.3,
            }} />
          ))}
        </div>
        <div className="hero-content">
          <div className="hero-eyebrow">AI Studio · New York</div>
          <h1 className="hero-headline">
            <AnimatedWord text="Not" baseDelay={0.2} />
            {' '}
            <AnimatedWord text="a" baseDelay={0.4} />
            {' '}
            <AnimatedWord text="Replacement." baseDelay={0.5} />
            <br />
            <AnimatedWord text="An" baseDelay={1.1} />
            {' '}
            <AnimatedWord text="Upgrade." baseDelay={1.3} isAccent />
          </h1>
          <p className="hero-tagline">
            We build Claude AI into the tools professionals already love — so creativity flows faster, work gets smarter, and humans stay in control.
          </p>
          <div className="hero-ctas">
            <a href="#apps" className="cta-button">See Our Apps</a>
            <a href="#contact" className="cta-link">Get in touch →</a>
          </div>
        </div>
        <div className="hero-visual">
          <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
            <OrbitControls enableZoom={false} enablePan={false} />
            <DodecahedronLogo />
          </Canvas>
        </div>
      </header>

      {/* ── Mission ── */}
      <section className="mission">
        <div className="mission-inner">
          <div className="mission-label">Our Belief</div>
          <blockquote className="mission-quote">
            AI shouldn't make you redundant.<br />
            It should make you <span className="accent">unstoppable.</span>
          </blockquote>
          <p className="mission-body">
            Custom Fusion builds AI-powered tools across every working environment — music, design, engineering, development. We don't chase trends. We find the places where talented people are still doing work that machines should be handling, and we fix that.
          </p>
          <div className="mission-stats">
            <div className="mstat"><span className="mstat-num">6</span><span className="mstat-label">Apps</span></div>
            <div className="mstat"><span className="mstat-num">6+</span><span className="mstat-label">Professional Tools Integrated</span></div>
            <div className="mstat"><span className="mstat-num">1</span><span className="mstat-label">AI at the Core</span></div>
          </div>
        </div>
      </section>

      {/* ── Apps ── */}
      <section id="apps" className="apps-section">
        <div className="section-header">
          <h2>Apps</h2>
          <p className="section-sub">Built from real frustration. Used every day.</p>
        </div>
        <div className="apps-grid">
          {APPS.map((app) => (
            <div key={app.name} className="app-card" style={{ background: app.bg }}>
              <div className="app-card-glow" style={{ background: app.accent }} />
              <div className="app-card-top">
                <div className="app-icon-large">
                  {app.iconImg ? <img src={app.iconImg} alt={`${app.name} icon`} className="app-icon-img" /> : app.icon}
                </div>
                <span className={`app-status ${app.statusType}`} style={app.statusType === 'available' ? { borderColor: app.accent, color: app.accent } : {}}>
                  {app.status}
                </span>
              </div>
              <h3 className="app-name">{app.name}</h3>
              <p className="app-tagline" style={{ color: app.accent }}>{app.tagline}</p>
              <p className="app-description">{app.description}</p>
              <div className="app-detail-line">{app.detail}</div>
              {app.href && (
                <a href={app.href} className="app-cta" style={{ background: app.accent }}>{app.cta}</a>
              )}
              <div className="app-platform">{app.platform}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Platform ── */}
      <section id="platform" className="platform-section">
        <div className="section-header">
          <h2>The Platform</h2>
          <p className="section-sub">One AI brain. Every professional environment.</p>
        </div>
        <div className="platform-body">
          <p className="platform-intro">
            At the core of everything we build is a single connected ecosystem. A <span className="accent">Mac</span>, a <span className="accent">PC</span>, an <span className="accent">Apple Watch</span>, an <span className="accent">iPhone</span> — all wired to Claude AI. The heavy creative tools run on the PC. The interfaces live on every device. The intelligence flows through all of it.
          </p>
          <div className="tools-grid">
            {TOOLS.map((tool) => (
              <div key={tool.name} className="tool-card">
                <div className="tool-name">{tool.name}</div>
                <div className="tool-category">{tool.category}</div>
              </div>
            ))}
          </div>
          <div className="platform-flow">
            <div className="flow-node">
              <div className="flow-node-title">Professional Tools</div>
              <div className="flow-node-sub">Ableton · Keyshot · Rhino · Blender</div>
            </div>
            <div className="flow-connector">
              <div className="flow-line" />
              <div className="flow-arrow-icon">→</div>
              <div className="flow-line" />
            </div>
            <div className="flow-node accent-node">
              <div className="flow-node-title">Claude AI</div>
              <div className="flow-node-sub">The intelligence layer</div>
            </div>
            <div className="flow-connector">
              <div className="flow-line" />
              <div className="flow-arrow-icon">→</div>
              <div className="flow-line" />
            </div>
            <div className="flow-node">
              <div className="flow-node-title">Your Devices</div>
              <div className="flow-node-sub">Mac · Apple Watch · iPhone</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="contact">
        <div className="contact-content">
          <h2>Let's Build Something</h2>
          <p className="contact-description">
            Got a workflow still living in 2015? A tool you wish could think for itself? An idea that doesn't fit anywhere yet? That's exactly where we work.
          </p>
          <a href="mailto:julian@customfusion.co" className="contact-email">julian@customfusion.co</a>
          <div className="contact-locations">
            <span>New York</span>
            <span className="contact-divider">·</span>
            <span>San Francisco</span>
            <span className="contact-divider">·</span>
            <span>Paris</span>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Custom Fusion Inc. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default App;
