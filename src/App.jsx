import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import DodecahedronLogo from './DodecahedronLogo';
import './App.css';

// Split text into individually animated letter spans
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

function App() {
  const [loaded, setLoaded] = useState(false);
  const [activeCollection, setActiveCollection] = useState(null);
  useEffect(() => { setLoaded(true); }, []);

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
        {/* Ambient floating particles */}
        <div className="hero-particles">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                animationDuration: `${8 + Math.random() * 15}s`,
                animationDelay: `${Math.random() * 10}s`,
                opacity: 0.1 + Math.random() * 0.3,
              }}
            />
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

          <div className="about-stats">
            <div className="stat">
              <span className="stat-number">20+</span>
              <span className="stat-label">Years of Experience</span>
            </div>
            <div className="stat">
              <span className="stat-number">2018</span>
              <span className="stat-label">Studio Founded</span>
            </div>
            <div className="stat">
              <span className="stat-number">NYC · SF · Paris</span>
              <span className="stat-label">Studio Locations</span>
            </div>
          </div>
        </div>
      </section>


      <section id="collections" className="portfolio">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
          <h2>{activeCollection ? `Collection / ${activeCollection}` : 'Collections'}</h2>
          {activeCollection && (
            <button 
              onClick={(e) => { e.preventDefault(); setActiveCollection(null); }}
              style={{ background: 'none', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-display)' }}
            >
              ← Back
            </button>
          )}
        </div>
        
        {!activeCollection ? (
          <div className="grid">
            <div className="card" onClick={() => setActiveCollection('Architecture')}>
              <div className="card-image" style={{backgroundImage: "url('/assets/maze.jpg')"}}></div>
              <div className="card-overlay">
                <h3>Architecture</h3>
              </div>
            </div>
            <div className="card" onClick={() => setActiveCollection('Furniture')}>
              <div className="card-image" style={{backgroundImage: "url('/assets/torus.jpg')"}}></div>
              <div className="card-overlay">
                <h3>Furniture</h3>
              </div>
            </div>
            <div className="card" onClick={() => setActiveCollection('Products')}>
              <div className="card-image" style={{backgroundImage: "url('/assets/products.jpg')"}}></div>
              <div className="card-overlay">
                <h3>Products</h3>
              </div>
            </div>
          </div>
        ) : activeCollection === 'Architecture' ? (
           <div className="grid">
             <div className="card">
                <div className="card-image" style={{backgroundImage: "url('/assets/maze.jpg')"}}></div>
                <div className="card-overlay">
                  <h3>Dew Catcher</h3>
                </div>
              </div>
           </div>
        ) : activeCollection === 'Furniture' ? (
          <div className="grid">
            <div className="card">
              <div className="card-image" style={{backgroundImage: "url('/assets/float.jpg')"}}></div>
              <div className="card-overlay">
                <h3>Float</h3>
              </div>
            </div>
            <div className="card">
              <div className="card-image" style={{backgroundImage: "url('/assets/torus.jpg')"}}></div>
              <div className="card-overlay">
                <h3>Torus Chair</h3>
              </div>
            </div>
            <div className="card">
              <div className="card-image" style={{backgroundImage: "url('/assets/lamp.jpg')"}}></div>
              <div className="card-overlay">
                <h3>Geo Lamp</h3>
              </div>
            </div>
          </div>
        ) : activeCollection === 'Products' ? (
          <div className="grid">
            <div className="card">
              <div className="card-image" style={{backgroundImage: "url('/assets/print.jpg')"}}></div>
              <div className="card-overlay">
                <h3>Print</h3>
              </div>
            </div>
            <div className="card">
              <div className="card-image" style={{backgroundImage: "url('/assets/industrial.jpg')"}}></div>
              <div className="card-overlay">
                <h3>Auto Cabinet</h3>
              </div>
            </div>
            <div className="card">
              <div className="card-image" style={{backgroundImage: "url('/assets/products.jpg')"}}></div>
              <div className="card-overlay">
                <h3>Cyber Ashtray</h3>
              </div>
            </div>
          </div>
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
