import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">Custom <span>Fusion</span></div>
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
          <div className="abstract-shape"></div>
        </div>
      </header>

      <section id="work" className="portfolio">
        <h2>Collections</h2>
        <div className="grid">
          <div className="card"><h3>Torus</h3></div>
          <div className="card"><h3>Print</h3></div>
          <div className="card"><h3>Float</h3></div>
          <div className="card"><h3>Line</h3></div>
          <div className="card"><h3>Industrial</h3></div>
          <div className="card"><h3>Architecture</h3></div>
        </div>
      </section>
    </div>
  );
}

export default App;
