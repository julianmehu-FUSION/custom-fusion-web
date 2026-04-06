import React from 'react';
import { Canvas } from '@react-three/fiber';
import DodecahedronLogo from './DodecahedronLogo';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">
          <img src="/favicon.svg" alt="Custom Fusion Logo" style={{ width: '36px', marginRight: '12px' }} />
          Custom&nbsp;<span>Fusion</span>
        </div>
        <ul className="nav-links">
          <li><a href="#work">Work</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <h1>Precision <span>Engineering.</span><br/>Bespoke <span>Design.</span></h1>
          <p>A fusion of art, craft, and technology.</p>
          <button className="cta-button">Explore Collections</button>
        </div>
        <div className="hero-visual">
          <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
            <DodecahedronLogo />
          </Canvas>
        </div>
      </header>

      <section id="work" className="portfolio">
        <h2>Collections</h2>
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
              <h3>Torus</h3>
            </div>
          </div>

          <div className="card">
            <div className="card-image" style={{backgroundImage: "url('/assets/print.jpg')"}}></div>
            <div className="card-overlay">
              <h3>Print</h3>
            </div>
          </div>

          <div className="card">
            <div className="card-image" style={{backgroundImage: "url('/assets/lamp.jpg')"}}></div>
            <div className="card-overlay">
              <h3>Geo</h3>
            </div>
          </div>

          <div className="card">
            <div className="card-image" style={{backgroundImage: "url('/assets/maze.jpg')"}}></div>
            <div className="card-overlay">
              <h3>Architecture</h3>
            </div>
          </div>

          <div className="card">
            <div className="card-image" style={{backgroundImage: "url('/assets/industrial.jpg')"}}></div>
            <div className="card-overlay">
              <h3>Industrial</h3>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default App;
