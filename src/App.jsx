import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import DodecahedronLogo from './DodecahedronLogo';
import AutoCabinet from './AutoCabinet';
import FingerprintChair from './FingerprintChair';
import './App.css';

function AnimatedWord({ text, baseDelay, isAccent }) {
  return (
    <span className={`word ${isAccent ? 'accent-word' : ''}`}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="letter"
          style={{ animationDelay: `${baseDelay + i * 0.04}s` }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

const ITEM_DETAILS = {
  'Float Bench': {
    hero: '/assets/float.jpg',
    description: 'A bench that appears to float — glass cylinder legs and a warm wood top define this minimal yet sculptural piece.',
    images: [
      { src: '/assets/float.jpg', label: 'FLOAT O-B18' },
      { src: '/assets/media__1775516703702.png', label: 'FLOAT B21-L1' },
      { src: '/assets/media__1775519157544.jpg', label: 'FLOAT B21-L2' },
    ],
    gallery: [
      '/assets/media__1775519794671.jpg',
      '/assets/media__1775521638481.jpg',
      '/assets/media__1775522872284.png',
      '/assets/media__1775524067797.jpg',
      '/assets/media__1775525554404.jpg',
      '/assets/media__1775526101273.jpg',
    ],
  },
  'Print Chair': {
    hero: '/assets/fingerprint_chair_thumbnail.png',
    description: 'A chair whose back is a 3D-printed lattice derived from a human fingerprint scan — no two chairs are identical.',
    images: [{ src: '/assets/fingerprint_chair_thumbnail.png', label: 'PRINT O-C16' }],
    gallery: [
      '/assets/media__1775527809970.png',
      '/assets/media__1775528111998.jpg',
      '/assets/media__1775528117636.jpg',
      '/assets/media__1775528124719.jpg',
      '/assets/media__1775528128838.jpg',
    ],
    has3D: true,
  },
  'Geo Lamp': {
    hero: '/assets/lamp.jpg',
    description: 'Geometric precision meets warm illumination. Each facet is CNC-machined from solid aluminium and hand-finished.',
    images: [{ src: '/assets/lamp.jpg', label: 'GEO LAMP' }],
    gallery: [],
  },
  'Print Table': {
    hero: '/assets/line.png',
    description: 'A coffee table whose surface carries the same fingerprint language as the Print Chair — designed to live together.',
    images: [{ src: '/assets/line.png', label: 'PRINT TABLE' }],
    gallery: [],
  },
  'Torus Chair X': {
    hero: '/assets/torus.jpg',
    description: 'A lounge chair built around a continuous torus frame — chrome steel and tension-woven seating in perfect equilibrium.',
    images: [
      { src: '/assets/torus.jpg', label: 'TORUS O-HC21' },
      { src: '/assets/media__1775529174534.jpg', label: 'TORUS T-ST21' },
      { src: '/assets/media__1775529379780.jpg', label: 'TORUS O-C21' },
    ],
    gallery: [],
  },
  'Auto Cabinet': {
    hero: '/assets/autocabinet_thumbnail.jpg',
    description: 'An automotive-inspired cabinet with precision-latched doors, brushed aluminium hardware, and a hidden interior lighting system.',
    images: [{ src: '/assets/autocabinet_thumbnail.jpg', label: 'AUTO CABINET' }],
    gallery: [],
    has3D: true,
  },
  'Cyber Ashtray': {
    hero: '/assets/products.jpg',
    description: 'Industrial-grade stainless with a matte-black PVD finish. Designed for the desk, not the patio.',
    images: [
      { src: '/assets/products.jpg', label: 'CYBER ASHTRAY' },
      { src: '/assets/products_cover.jpg', label: 'CYBER ASHTRAY - DETAIL' },
    ],
    gallery: [],
  },
  'Torus': {
    hero: '/assets/torus.jpg',
    description: 'The TORUS collection explores continuous form through lounge chairs and seating built around circular steel frames.',
    images: [{ src: '/assets/torus.jpg', label: 'TORUS' }],
    gallery: [],
  },
  'Print': {
    hero: '/assets/fingerprint_chair_thumbnail.png',
    description: 'The PRINT collection uses fingerprint and organic pattern language across seating, tables, and surfaces.',
    images: [{ src: '/assets/fingerprint_chair_thumbnail.png', label: 'PRINT' }],
    gallery: [],
  },
  'Float': {
    hero: '/assets/float.jpg',
    description: 'The FLOAT collection features benches and seating that appear weightless, hovering above glass and steel bases.',
    images: [{ src: '/assets/float.jpg', label: 'FLOAT' }],
    gallery: [],
  },
  'Maze': {
    hero: '/assets/maze.png',
    description: 'The MAZE collection draws from labyrinthine geometry to create storage, dressers, and architectural furniture.',
    images: [{ src: '/assets/maze.png', label: 'MAZE' }],
    gallery: [],
  },
  'Line': {
    hero: '/assets/line.png',
    description: 'The LINE collection channels precise geometric lines into tables, shelving, and minimalist furniture forms.',
    images: [{ src: '/assets/line.png', label: 'LINE' }],
    gallery: [],
  },
};

const backBtnStyle = {
  background: 'none',
  border: '1px solid var(--primary-color)',
  color: 'var(--primary-color)',
  padding: '0.5rem 1rem',
  cursor: 'pointer',
  borderRadius: '4px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontFamily: 'var(--font-display)',
};

function ItemDetail({ itemName, onBack }) {
  const [show3D, setShow3D] = useState(false);
  const detail = ITEM_DETAILS[itemName];
  if (!detail) return null;

  if (show3D) {
    return (
      <div style={{ width: '100%', height: '80vh', position: 'relative', background: itemName === 'Auto Cabinet' ? '#ffffff' : '#0a0a0a' }}>
        <button onClick={() => setShow3D(false)} style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, background: '#333', color: '#fff', border: 'none', padding: '8px 16px', cursor: 'pointer', borderRadius: 4 }}>
          Close Viewer
        </button>
        {itemName === 'Auto Cabinet' ? <AutoCabinet /> : <FingerprintChair />}
      </div>
    );
  }

  return (
    <div className="item-detail">
      <div className="item-detail-hero" style={{ backgroundImage: `url('${detail.hero}')` }}>
        <div className="item-detail-hero-overlay">
          <h2 className="item-detail-title">{itemName.toUpperCase()}</h2>
        </div>
      </div>
      <p className="item-detail-desc">{detail.description}</p>
      {detail.has3D && (
        <button onClick={() => setShow3D(true)} style={{ ...backBtnStyle, marginBottom: '2rem' }}>
          View 3D Model
        </button>
      )}
      {detail.images.length > 0 && (
        <div className="grid" style={{ marginBottom: '2rem' }}>
          {detail.images.map((img, i) => (
            <div key={i} className="card variant-card">
              <div className="card-image" style={{ backgroundImage: `url('${img.src}')` }}></div>
              <div className="card-overlay"><h3>{img.label}</h3></div>
            </div>
          ))}
        </div>
      )}
      {detail.gallery.length > 0 && (
        <div className="photo-grid">
          {detail.gallery.map((src, i) => (
            <div key={i} className="photo-tile" style={{ backgroundImage: `url('${src}')` }}></div>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  const [loaded, setLoaded] = useState(false);
  const [activeCollection, setActiveCollection] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    document.fonts.ready.then(() => setLoaded(true));
  }, []);

  return (
    <div className={`app-container ${loaded ? 'loaded' : ''}`}>

      <nav className="navbar">
        <div className="logo">
          <img src="/logo.png" alt="Custom Fusion Logo" style={{ width: '36px', marginRight: '12px' }} />
          Custom&nbsp;<span>Fusion</span>
        </div>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#collections">Collections</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

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
          <h1 className="hero-headline">
            <AnimatedWord text="Precision" baseDelay={0.2} />
            {' '}
            <AnimatedWord text="Engineering." baseDelay={0.6} isAccent />
            <br />
            <AnimatedWord text="Bespoke" baseDelay={1.2} />
            {' '}
            <AnimatedWord text="Design." baseDelay={1.6} isAccent />
          </h1>
          <p className="hero-tagline">A fusion of art, craft, and technology.</p>
          <a href="#collections" className="cta-button">Explore Collections</a>
        </div>
        <div className="hero-visual">
          <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
            <OrbitControls enableZoom={false} enablePan={false} />
            <DodecahedronLogo />
          </Canvas>
        </div>
      </header>

      <section id="about" className="about">
        <div className="about-header">
          <h2>About</h2>
        </div>

        <div className="about-content">
          <div className="about-story">
            <div className="about-block">
              <p className="about-lead">
                Custom Fusion is a boutique design and product development studio where raw material becomes refined object. Founded in <span className="accent">2018</span>, the studio brings over two decades of hands-on fabrication and engineering to every project — with an obsession for craft that borders on unreasonable.
              </p>
            </div>

            <div className="about-block">
              <p>
                The studio's roots trace back to the workshops of New York City, where founder Julian Mehu first apprenticed under sculptor <span className="accent">Jason Young</span> — learning to think in materials, push beyond convention, and treat every surface as an opportunity for expression. That foundation in art and material experimentation continues to define the studio's approach.
              </p>
            </div>

            <div className="about-pullquote">
              <blockquote>
                "Each creation is unique — guided by purpose and material honesty."
              </blockquote>
            </div>

            <div className="about-block">
              <p>
                From concept to completion, Custom Fusion operates at the intersection of digital precision and traditional craft. The studio works across advanced fabrication methods — CNC machining, additive manufacturing, welding, and CAD-driven design — augmented by <span className="accent">proprietary AI tools</span> for design optimization, generative modeling, and custom CAD workflows. Technology in service of a single idea: that the best objects are the ones you can feel were made with intention.
              </p>
            </div>

            <div className="about-block">
              <p>
                Whether developing a one-of-a-kind sculptural piece or engineering a production-ready product, the studio's work is defined by meticulous attention to detail and the belief that design should move people — visually, functionally, and emotionally.
              </p>
            </div>
          </div>

          <div className="about-gallery">
            <div className="gallery-item">
              <div className="gallery-img" style={{backgroundImage: "url('/assets/about-welding.png')"}}></div>
              <span className="gallery-label">Welding</span>
            </div>
            <div className="gallery-item">
              <div className="gallery-img" style={{backgroundImage: "url('/assets/about-resin.png')"}}></div>
              <span className="gallery-label">Resin Casting</span>
            </div>
            <div className="gallery-item">
              <div className="gallery-img" style={{backgroundImage: "url('/assets/about-cnc.png')"}}></div>
              <span className="gallery-label">CNC Machining</span>
            </div>
            <div className="gallery-item">
              <div className="gallery-img" style={{backgroundImage: "url('/assets/about-3dprint.png')"}}></div>
              <span className="gallery-label">3D Printing</span>
            </div>
            <div className="gallery-item">
              <div className="gallery-img" style={{backgroundImage: "url('/assets/about-texture.png')"}}></div>
              <span className="gallery-label">Material Study</span>
            </div>
            <div className="gallery-item">
              <div className="gallery-img" style={{backgroundImage: "url('/assets/about-sculpture.png')"}}></div>
              <span className="gallery-label">Product Development</span>
            </div>
          </div>
        </div>
      </section>

      <section id="collections" className="portfolio">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
          <h2>
            {activeItem
              ? `Collection / ${activeCollection} / ${activeItem}`
              : activeCollection
              ? `Collection / ${activeCollection}`
              : 'Collections'}
          </h2>
          {activeCollection && (
            <button onClick={(e) => { e.preventDefault(); if (activeItem) setActiveItem(null); else setActiveCollection(null); }} style={backBtnStyle}>
              ← Back
            </button>
          )}
        </div>

        {!activeCollection ? (
          <div className="grid">
            <div className="card" onClick={() => setActiveCollection('Architecture')}>
              <div className="card-image" style={{backgroundImage: "url('/assets/maze.png')"}}></div>
              <div className="card-overlay"><h3>Architecture</h3></div>
            </div>
            <div className="card" onClick={() => setActiveCollection('Furniture')}>
              <div className="card-image" style={{backgroundImage: "url('/assets/torus.jpg')"}}></div>
              <div className="card-overlay"><h3>Furniture</h3></div>
            </div>
            <div className="card" onClick={() => setActiveCollection('Products')}>
              <div className="card-image" style={{backgroundImage: "url('/assets/products_cover.jpg')"}}></div>
              <div className="card-overlay"><h3>Products</h3></div>
            </div>
          </div>
        ) : null}

        {activeCollection === 'Architecture' ? (
          activeItem ? (
            <ItemDetail itemName={activeItem} onBack={() => setActiveItem(null)} />
          ) : (
            <div className="grid">
              <div className="card" onClick={() => setActiveItem('Dew Catcher')}>
                <div className="card-image" style={{backgroundImage: "url('/assets/media__1775516703702.png')"}}></div>
                <div className="card-overlay"><h3>Dew Catcher</h3></div>
              </div>
            </div>
          )
        ) : null}

        {activeCollection === 'Furniture' ? (
          activeItem ? (
            <ItemDetail itemName={activeItem} onBack={() => setActiveItem(null)} />
          ) : (
            <div className="grid">
              <div className="card" onClick={() => setActiveItem('Torus')}>
                <div className="card-image" style={{backgroundImage: "url('/assets/torus.jpg')"}}></div>
                <div className="card-overlay"><h3>Torus</h3></div>
              </div>
              <div className="card" onClick={() => setActiveItem('Print')}>
                <div className="card-image" style={{backgroundImage: "url('/assets/fingerprint_chair_thumbnail.png')"}}></div>
                <div className="card-overlay"><h3>Print</h3></div>
              </div>
              <div className="card" onClick={() => setActiveItem('Float')}>
                <div className="card-image" style={{backgroundImage: "url('/assets/float.jpg')"}}></div>
                <div className="card-overlay"><h3>Float</h3></div>
              </div>
              <div className="card" onClick={() => setActiveItem('Maze')}>
                <div className="card-image" style={{backgroundImage: "url('/assets/maze.png')"}}></div>
                <div className="card-overlay"><h3>Maze</h3></div>
              </div>
              <div className="card" onClick={() => setActiveItem('Line')}>
                <div className="card-image" style={{backgroundImage: "url('/assets/line.png')"}}></div>
                <div className="card-overlay"><h3>Line</h3></div>
              </div>
            </div>
          )
        ) : null}

        {activeCollection === 'Products' ? (
          activeItem === 'Auto Cabinet' ? (
            <div style={{ width: '100%', height: '80vh', position: 'relative', background: '#ffffff' }}>
              <button onClick={() => setActiveItem(null)} style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, background: '#ffffff', border: '1px solid #bba', color: '#333', padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
                Close Viewer
              </button>
              <AutoCabinet />
            </div>
          ) : (
            <div className="grid">
              <div className="card" onClick={() => setActiveItem('Auto Cabinet')}>
                <div className="card-image" style={{backgroundImage: "url('/assets/autocabinet_thumbnail.jpg')"}}></div>
                <div className="card-overlay"><h3>Auto Cabinet</h3></div>
              </div>
              <div className="card">
                <div className="card-image" style={{backgroundImage: "url('/assets/products_cover.jpg')"}}></div>
                <div className="card-overlay"><h3>Cyber Ashtray</h3></div>
              </div>
            </div>
          )
        ) : null}
      </section>

      <section id="contact" className="contact">
        <div className="contact-content">
          <h2>Let's Build Something</h2>
          <p className="contact-description">
            Have a project in mind? Whether it's a bespoke sculptural commission, a product development challenge, or an idea that hasn't found its form yet — we'd love to hear about it.
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
        <p>© {new Date().getFullYear()} Custom Fusion. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
