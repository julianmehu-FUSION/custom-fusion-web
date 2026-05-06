import React, { useEffect, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import DodecahedronLogo from './DodecahedronLogo';
import './App.css';

const IMAGES = [
  '/assets/selects/08e1b90c-a291-4194-b11b-509ea72d0c4a_render.jpg',
  '/assets/selects/FINGERPRINT_COL_STAGED.60_render.jpg',
  '/assets/selects/HANGING_TORUS_CHAIR_02_render.jpg',
  '/assets/selects/FLOAT_B21-L2_01.3_render.jpg',
  '/assets/selects/MAZE.png',
  '/assets/selects/GEO_LAMP.10_render.jpg',
  '/assets/selects/PHANTOM_V1_03_render.jpg',
  '/assets/selects/FLOATING_BENCH_RED_LAQUER.6_render.jpg',
  '/assets/selects/LINE.png',
  '/assets/selects/BOTTLE_2 V3_render.jpg',
  '/assets/selects/TORUS_render.jpg',
  '/assets/selects/1_render.jpg',
  '/assets/selects/FINGERPRINT_COL_STAGED.61_render.jpg',
  '/assets/selects/HANGING_TORUS_CHAIR_03-0001_render.jpg',
  '/assets/selects/FLOAT_B21-L2_01.51_render.jpg',
  '/assets/selects/GEO_LAMP2_render.jpg',
  '/assets/selects/BOTTLE_2 V4_render.jpg',
  '/assets/selects/FLOAT_B21-L2_01.5_render.jpg',
  '/assets/selects/3.10_render.jpg',
  '/assets/selects/print-chair.png',
  '/assets/selects/FLOAT_B21-L2_01.53_render.jpg',
  '/assets/selects/LAMP SIDE TABLE.77_render.jpg',
  '/assets/selects/b7526da5-c68b-4491-8d94-d2a6fa2bad0b_render.jpg',
  '/assets/selects/LAMP SIDE TABLE.78 (1)_render.jpg',
  '/assets/selects/41d7c740-6168-4053-9139-35673b18a79c_render.jpg',
  '/assets/selects/WARKA TOWER V2.2 sm_render.jpg',
  '/assets/selects/LAMP SIDE TABLE.78 (2)_render.jpg',
  '/assets/selects/a82a2914-8bc6-4ccc-9ec5-92124913a46d_render.jpg',
  '/assets/selects/4fffdea7-d231-4434-b68f-6d8a93f1b43f_render.jpg',
  '/assets/selects/LAMP SIDE TABLE.79 (3)_render.jpg',
  '/assets/selects/ac4af227-ac7f-4048-8f3e-0495bb23e633_render.jpg',
  '/assets/selects/53e65cdb-9f84-4d5f-9347-04b05c00e8b2_render.jpg',
  '/assets/selects/print-table.jpg',
  '/assets/selects/b802ec5e-cc02-4f4d-b893-7cb45c8c40e7_render.jpg',
  '/assets/selects/67c0e752-e0da-4c22-bce8-615f58090727_render.jpg',
  '/assets/selects/blob_render.jpg',
  '/assets/selects/df085e62-7ec5-4221-bff0-88ac8e282a4c_render.jpg',
  '/assets/selects/93c708c5-dfdd-49a8-a0b3-b19130480b59_render.jpg',
  '/assets/selects/e6cad814-7052-4e6b-b799-1dbdde6a5644_render.jpg',
  '/assets/selects/97bb7159-4778-47a7-a4d4-f80fbbdaf1bc_render.jpg',
  '/assets/selects/f072f327-27e2-417d-ab86-0498ba21bdd2_render.jpg',
  '/assets/selects/IMG_6781_render.jpg',
  '/assets/selects/IMG_6783_render.jpg',
  '/assets/selects/Arch.jpg',
  '/assets/selects/test_customfusion_2_render.jpg',
  '/assets/selects/Gemini_Generated_Image_d1978fd1978fd197_render.jpg',
];

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
  'Torus Canopy': {
    hero: '/assets/torus_canopy_01.jpg',
    description: 'The TORUS CANOPY wraps its occupant in a continuous steel arc — a cantilevered shelter that doubles as seating.',
    images: [
      { src: '/assets/torus_canopy_01.jpg', label: 'CANOPY — VIEW 01' },
      { src: '/assets/torus_canopy_02.jpg', label: 'CANOPY — VIEW 02' },
      { src: '/assets/torus_canopy_03.jpg', label: 'CANOPY — VIEW 03' },
      { src: '/assets/torus_canopy_04.jpg', label: 'CANOPY — VIEW 04' },
    ],
    gallery: [],
  },
  'Torus Swing': {
    hero: '/assets/torus.jpg',
    description: 'The TORUS SWING suspends a continuous torus frame from a single tension point — motion and form unified.',
    images: [{ src: '/assets/torus.jpg', label: 'SWING — COMING SOON' }],
    gallery: [],
  },
  'Torus Lounge': {
    hero: '/assets/torus_lounge_01.png',
    description: 'The TORUS LOUNGE Chair wraps chrome-steel tubing into a seamless reclined frame with tension-woven seating.',
    images: [
      { src: '/assets/torus_lounge_01.png', label: 'LOUNGE — VIEW 01' },
      { src: '/assets/torus_lounge_02.png', label: 'LOUNGE — VIEW 02' },
      { src: '/assets/torus_lounge_03.png', label: 'LOUNGE — VIEW 03' },
      { src: '/assets/torus_lounge_04.png', label: 'LOUNGE — VIEW 04' },
    ],
    gallery: [],
  },
  'Torus Recliner': {
    hero: '/assets/torus_recliner_01.jpg',
    description: 'The TORUS RECLINER extends the circular frame language into a full-recline position — chrome steel, zero compromise.',
    images: [
      { src: '/assets/torus_recliner_01.jpg', label: 'RECLINER — VIEW 01' },
      { src: '/assets/torus_recliner_02.jpg', label: 'RECLINER — VIEW 02' },
      { src: '/assets/torus_recliner_03.jpg', label: 'RECLINER — VIEW 03' },
      { src: '/assets/torus_recliner_04.jpg', label: 'RECLINER — VIEW 04' },
    ],
    gallery: [],
  },
  'Torus Foot Rest': {
    hero: '/assets/torus_footrest_01.jpg',
    description: 'The TORUS FOOT REST completes the collection — a low torus-frame ottoman with precision-upholstered surface.',
    images: [
      { src: '/assets/torus_footrest_01.jpg', label: 'FOOT REST — VIEW 01' },
      { src: '/assets/torus_footrest_02.jpg', label: 'FOOT REST — VIEW 02' },
      { src: '/assets/torus_footrest_03.jpg', label: 'FOOT REST — VIEW 03' },
      { src: '/assets/torus_footrest_04.jpg', label: 'FOOT REST — VIEW 04' },
    ],
    gallery: [],
  },
  'Print': {
    hero: '/assets/print_collection.jpg',
    description: 'The PRINT collection uses fingerprint and organic pattern language across seating, tables, and surfaces.',
    images: [{ src: '/assets/print_collection.jpg', label: 'PRINT' }],
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
  const [lightbox, setLightbox] = useState(null); // index or null

  const openLightbox = (i) => setLightbox(i);
  const closeLightbox = () => setLightbox(null);
  const prev = useCallback(() => setLightbox(i => (i - 1 + IMAGES.length) % IMAGES.length), []);
  const next = useCallback(() => setLightbox(i => (i + 1) % IMAGES.length), []);

  useEffect(() => {
    document.fonts.ready.then(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, prev, next]);

  return (
    <div className={`app-container ${loaded ? 'loaded' : ''}`}>

      <nav className="navbar">
        <div className="logo">
          <img src="/logo.png" alt="Custom Fusion Logo" style={{ width: '36px', marginRight: '12px' }} />
          Custom&nbsp;<span>Fusion</span>
        </div>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#work">Work</a></li>
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
          <a href="#work" className="cta-button">View Work</a>
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

      <section id="work" className="portfolio">
        <h2 style={{ marginBottom: '3rem' }}>Work</h2>
        <div className="masonry">
          {IMAGES.map((src, i) => (
            <div key={i} className="masonry-item" onClick={() => openLightbox(i)}>
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {lightbox !== null && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>✕</button>
          <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); prev(); }}>‹</button>
          <img
            src={IMAGES[lightbox]}
            alt=""
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); next(); }}>›</button>
          <span className="lightbox-counter">{lightbox + 1} / {IMAGES.length}</span>
        </div>
      )}

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
