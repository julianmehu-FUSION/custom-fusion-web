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
                    </span>span>
                  ))}
          </span>span>
        );
}

// ── Detail page image galleries ──────────────────────────────────────────────

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
          description: 'Biometric identity fused with furniture — the fingerprint pattern pressed into every surface makes each chair truly one of a kind.',
          images: [
            { src: '/assets/fingerprint_chair_thumbnail.png', label: 'PRINT O-TC16' },
            { src: '/assets/media__1775527809970.png', label: 'PRINT O-TO16' },
            { src: '/assets/media__1775528111998.jpg', label: 'PRINT O-C16' },
                ],
          gallery: [
                  '/assets/media__1775528117636.jpg',
                  '/assets/media__1775528124719.jpg',
                  '/assets/media__1775528128838.jpg',
                ],
          has3D: true,
    },
    'Geo Lamp': {
          hero: '/assets/lamp.jpg',
          description: 'Geometric precision meets warm illumination. Each facet is CNC-machined from solid aluminium and hand-finished.',
          images: [
            { src: '/assets/lamp.jpg', label: 'GEO LAMP' },
                ],
          gallery: [],
    },
    'Print Table': {
          hero: '/assets/print.jpg',
          description: 'A coffee table whose surface carries the same fingerprint language as the Print Chair — designed to live together.',
          images: [
            { src: '/assets/print.jpg', label: 'PRINT TABLE' },
                ],
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
          images: [
            { src: '/assets/autocabinet_thumbnail.jpg', label: 'AUTO CABINET' },
                ],
          gallery: [],
          has3D: true,
    },
    'Cyber Ashtray': {
          hero: '/assets/products.jpg',
          description: 'Industrial-grade stainless with a matte-black PVD finish. Designed for the desk, not the patio.',
          images: [
            { src: '/assets/products.jpg', label: 'CYBER ASHTRAY' },
            { src: '/assets/products_cover.jpg', label: 'CYBER ASHTRAY — DETAIL' },
                ],
          gallery: [],
    },
};

// ── Shared back-button style ──────────────────────────────────────────────────
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

// ── Item detail view ──────────────────────────────────────────────────────────
function ItemDetail({ itemName, onBack }) {
    const [show3D, setShow3D] = useState(false);
    const detail = ITEM_DETAILS[itemName];
    if (!detail) return null;
  
    if (show3D) {
          return (
                  <div style={{ width: '100%', height: '80vh', position: 'relative', background: itemName === 'Auto Cabinet' ? '#ffffff' : '#f5f5f7', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                          <button onClick={() => setShow3D(false)} style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, background: '#ffffff', border: '1px solid #bba', color: '#333', padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
                                    Close Viewer
                          </button>button>
                    {itemName === 'Auto Cabinet' ? <AutoCabinet /> : <FingerprintChair />}
                  </div>div>
                );
    }
  
    return (
          <div className="item-detail">
            {/* Hero */}
                <div className="item-detail-hero" style={{ backgroundImage: `url('${detail.hero}')` }}>
                        <div className="item-detail-hero-overlay">
                                  <h3 className="item-detail-title">{itemName.toUpperCase()}</h3>h3>
                        </div>div>
                </div>div>
          
            {detail.description && (
                    <p className="item-detail-desc">{detail.description}</p>p>
                )}
          
            {detail.has3D && (
                    <button onClick={() => setShow3D(true)} style={{ ...backBtnStyle, marginBottom: '2rem' }}>
                              View 3D Model
                    </button>button>
                )}
          
            {/* Product variant grid */}
            {detail.images.length > 0 && (
                    <div className="grid" style={{ marginBottom: '2rem' }}>
                      {detail.images.map((img, i) => (
                                  <div key={i} className="card variant-card">
                                                <div className="card-image" style={{ backgroundImage: `url('${img.src}')` }}></div>div>
                                                <div className="card-overlay">
                                                                <h3>{img.label}</h3>h3>
                                                </div>div>
                                  </div>div>
                                ))}
                    </div>div>
                )}
          
            {/* Extra gallery photos */}
            {detail.gallery.length > 0 && (
                    <div className="photo-grid">
                      {detail.gallery.map((src, i) => (
                                  <div key={i} className="photo-tile" style={{ backgroundImage: `url('${src}')` }}></div>div>
                                ))}
                    </div>div>
                )}
          </div>div>
        );
}

// ── Main App ──────────────────────────────────────────────────────────────────
function App() {
    const [loaded, setLoaded] = useState(false);
    const [activeCollection, setActiveCollection] = useState(null);
    const [activeItem, setActiveItem] = useState(null);
  
    useEffect(() => {
          document.fonts.ready.then(() => {
                  setLoaded(true);
          });
    }, []);
  
    const handleBack = (e) => {
          e.preventDefault();
          if (activeItem) setActiveItem(null);
          else setActiveCollection(null);
    };
  
    return (
          <div className={`app-container ${loaded ? 'loaded' : ''}`}>
                <nav className="navbar">
                        <div className="logo">
                                  <img src="/logo.png" alt="Custom Fusion Logo" style={{ width: '36px', marginRight: '12px' }} />
                                  Custom&nbsp;<span>Fusion</span>span>
                        </div>div>
                        <ul className="nav-links">
                                  <li><a href="#about">About</a>a></li>li>
                                  <li><a href="#collections">Collections</a>a></li>li>
                                  <li><a href="#contact">Contact</a>a></li>li>
                        </ul>ul>
                </nav>nav>
          
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
                        </div>div>
                        <div className="hero-content">
                                  <h1 className="hero-headline">
                                              <AnimatedWord text="Precision" baseDelay={0.2} />
                                    {' '}
                                              <AnimatedWord text="Engineering." baseDelay={0.6} isAccent />
                                              <br />
                                              <AnimatedWord text="Bespoke" baseDelay={1.2} />
                                    {' '}
                                              <AnimatedWord text="Design." baseDelay={1.6} isAccent />
                                  </h1>h1>
                                  <p className="hero-tagline">A fusion of art, craft, and technology.</p>p>
                                  <a href="#collections" className="cta-button">Explore Collections</a>a>
                        </div>div>
                        <div className="hero-visual">
                                  <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
                                              <OrbitControls enableZoom={false} enablePan={false} />
                                              <DodecahedronLogo />
                                  </Canvas>Canvas>
                        </div>div>
                </header>header>
          
                <section id="about" className="about">
                        <div className="about-header">
                                  <h2>About</h2>h2>
                        </div>div>
                        <div className="about-content">
                                  <div className="about-story">
                                              <div className="about-block">
                                                            <p className="about-lead">
                                                                            Custom Fusion is a boutique design and product development studio where raw material becomes refined object. Founded in <span className="accent">2018</span>span>, the studio brings over two decades of hands-on fabrication and engineering to every project — with an obsession for craft that borders on unreasonable.
                                                            </p>p>
                                              </div>div>
                                              <div className="about-block">
                                                            <p>
                                                                            The studio's roots trace back to the workshops of New York City, where founder Julian Mehu first apprenticed under sculptor <span className="accent">Jason Young</span>span> — learning to think in materials, push beyond convention, and treat every surface as an opportunity for expression. That foundation in art and material experimentation continues to define the studio's approach.
                                                            </p>p>
                                              </div>div>
                                              <div className="about-pullquote">
                                                            <blockquote>
                                                                            "Each creation is unique — guided by purpose and material honesty."
                                                            </blockquote>blockquote>
                                              </div>div>
                                              <div className="about-block">
                                                            <p>
                                                                            From concept to completion, Custom Fusion operates at the intersection of digital precision and traditional craft. The studio works across advanced fabrication methods — CNC machining, additive manufacturing, welding, and CAD-driven design — augmented by <span className="accent">proprietary AI tools</span>span> for design optimization, generative modeling, and custom CAD workflows. Technology in service of a single idea: that the best objects are the ones you can feel were made with intention.
                                                            </p>p>
                                              </div>div>
                                              <div className="about-block">
                                                            <p>
                                                                            Whether developing a one-of-a-kind sculptural piece or engineering a production-ready product, the studio's work is defined by meticulous attention to detail and the belief that design should move people — visually, functionally, and emotionally.
                                                            </p>p>
                                              </div>div>
                                  </div>div>
                                  <div className="about-gallery">
                                              <div className="gallery-item">
                                                            <div className="gallery-img" style={{backgroundImage: "url('/assets/about-welding.png')"}}></div>div>
                                                            <span className="gallery-label">Welding</span>span>
                                              </div>div>
                                              <div className="gallery-item">
                                                            <div className="gallery-img" style={{backgroundImage: "url('/assets/about-resin.png')"}}></div>div>
                                                            <span className="gallery-label">Resin Casting</span>span>
                                              </div>div>
                                              <div className="gallery-item">
                                                            <div className="gallery-img" style={{backgroundImage: "url('/assets/about-cnc.png')"}}></div>div>
                                                            <span className="gallery-label">CNC Machining</span>span>
                                              </div>div>
                                              <div className="gallery-item">
                                                            <div className="gallery-img" style={{backgroundImage: "url('/assets/about-3dprint.png')"}}></div>div>
                                                            <span className="gallery-label">3D Printing</span>span>
                                              </div>div>
                                              <div className="gallery-item">
                                                            <div className="gallery-img" style={{backgroundImage: "url('/assets/about-texture.png')"}}></div>div>
                                                            <span className="gallery-label">Material Study</span>span>
                                              </div>div>
                                              <div className="gallery-item">
                                                            <div className="gallery-img" style={{backgroundImage: "url('/assets/about-sculpture.png')"}}></div>div>
                                                            <span className="gallery-label">Product Development</span>span>
                                              </div>div>
                                  </div>div>
                                  <div className="about-stats">
                                              <div className="stat">
                                                            <span className="stat-number">20+</span>span>
                                                            <span className="stat-label">Years of Experience</span>span>
                                              </div>div>
                                              <div className="stat">
                                                            <span className="stat-number">2018</span>span>
                                                            <span className="stat-label">Studio Founded</span>span>
                                              </div>div>
                                              <div className="stat">
                                                            <span className="stat-number">NYC · SF · Paris</span>span>
                                                            <span className="stat-label">Studio Locations</span>span>
                                              </div>div>
                                  </div>div>
                        </div>div>
                </section>section>
          
                <section id="collections" className="portfolio">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                                  <h2>
                                    {activeItem
                                                    ? `Collection / ${activeCollection} / ${activeItem}`
                                                    : activeCollection
                                                    ? `Collection / ${activeCollection}`
                                                    : 'Collections'}
                                  </h2>h2>
                          {activeCollection && (
                        <button onClick={handleBack} style={backBtnStyle}>
                                      ← Back
                        </button>button>
                                  )}
                        </div>div>
                
                  {/* ── Top-level collection grid ── */}
                  {!activeCollection ? (
                      <div className="grid">
                                  <div className="card" onClick={() => setActiveCollection('Architecture')}>
                                                <div className="card-image" style={{backgroundImage: "url('/assets/maze.jpg')"}}></div>div>
                                                <div className="card-overlay"><h3>Architecture</h3>h3></div>div>
                                  </div>div>
                                  <div className="card" onClick={() => setActiveCollection('Furniture')}>
                                                <div className="card-image" style={{backgroundImage: "url('/assets/torus.jpg')"}}></div>div>
                                                <div className="card-overlay"><h3>Furniture</h3>h3></div>div>
                                  </div>div>
                                  <div className="card" onClick={() => setActiveCollection('Products')}>
                                                <div className="card-image" style={{backgroundImage: "url('/assets/products_cover.jpg')"}}></div>div>
                                                <div className="card-overlay"><h3>Products</h3>h3></div>div>
                                  </div>div>
                      </div>div>
            
                    /* ── Architecture ── */
                    ) : activeCollection === 'Architecture' ? (
                      <div className="grid">
                                  <div className="card">
                                                <div className="card-image" style={{backgroundImage: "url('/assets/maze.jpg')"}}></div>div>
                                                <div className="card-overlay"><h3>Dew Catcher</h3>h3></div>div>
                                  </div>div>
                      </div>div>
            
                    /* ── Furniture ── */
                    ) : activeCollection === 'Furniture' ? (
                      activeItem ? (
                                    <ItemDetail itemName={activeItem} onBack={() => setActiveItem(null)} />
                                  ) : (
                                    <div className="grid">
                                                  <div className="card" onClick={() => setActiveItem('Float Bench')}>
                                                                  <div className="card-image" style={{backgroundImage: "url('/assets/float.jpg')"}}></div>div>
                                                                  <div className="card-overlay"><h3>Float Bench</h3>h3></div>div>
                                                  </div>div>
                                                  <div className="card" onClick={() => setActiveItem('Print Chair')}>
                                                                  <div className="card-image" style={{backgroundImage: "url('/assets/fingerprint_chair_thumbnail.png')"}}></div>div>
                                                                  <div className="card-overlay"><h3>Print Chair</h3>h3></div>div>
                                                  </div>div>
                                                  <div className="card" onClick={() => setActiveItem('Geo Lamp')}>
                                                                  <div className="card-image" style={{backgroundImage: "url('/assets/lamp.jpg')"}}></div>div>
                                                                  <div className="card-overlay"><h3>Geo Lamp</h3>h3></div>div>
                                                  </div>div>
                                                  <div className="card" onClick={() => setActiveItem('Print Table')}>
                                                                  <div className="card-image" style={{backgroundImage: "url('/assets/print.jpg')"}}></div>div>
                                                                  <div className="card-overlay"><h3>Print Table</h3>h3></div>div>
                                                  </div>div>
                                                  <div className="card" onClick={() => setActiveItem('Torus Chair X')}>
                                                                  <div className="card-image" style={{backgroundImage: "url('/assets/torus.jpg')"}}></div>div>
                                                                  <div className="card-overlay"><h3>Torus Chair X</h3>h3></div>div>
                                                  </div>div>
                                    </div>div>
                                  )
            
                    /* ── Products ── */
                    ) : activeCollection === 'Products' ? (
                      activeItem ? (
                                    <ItemDetail itemName={activeItem} onBack={() => setActiveItem(null)} />
                                  ) : (
                                    <div className="grid">
                                                  <div className="card" onClick={() => setActiveItem('Auto Cabinet')}>
                                                                  <div className="card-image" style={{backgroundImage: "url('/assets/autocabinet_thumbnail.jpg')"}}></div>div>
                                                                  <div className="card-overlay"><h3>Auto Cabinet</h3>h3></div>div>
                                                  </div>div>
                                                  <div className="card" onClick={() => setActiveItem('Cyber Ashtray')}>
                                                                  <div className="card-image" style={{backgroundImage: "url('/assets/products.jpg')"}}></div>div>
                                                                  <div className="card-overlay"><h3>Cyber Ashtray</h3>h3></div>div>
                                                  </div>div>
                                    </div>div>
                                  )
                    ) : null}
                </section>section>
          
                <section id="contact" className="contact">
                        <div className="contact-content">
                                  <h2>Let's Build Something</h2>h2>
                                  <p className="contact-description">
                                              Have a project in mind? Whether it's a bespoke sculptural commission, a product development challenge, or an idea that hasn't found its form yet — we'd love to hear about it.
                                  </p>p>
                                  <a href="mailto:julian@customfusion.co" className="contact-email">julian@customfusion.co</a>a>
                                  <div className="contact-locations">
                                              <span>New York</span>span>
                                              <span className="contact-divider">·</span>span>
                                              <span>San Francisco</span>span>
                                              <span className="contact-divider">·</span>span>
                                              <span>Paris</span>span>
                                  </div>div>
                        </div>div>
                </section>section>
          
                <footer className="site-footer">
                        <p>© {new Date().getFullYear()} Custom Fusion. All rights reserved.</p>p>
                </footer>footer>
          </div>div>
        );
}

export default App;</span>
