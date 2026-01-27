import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <main className="landing-container">
      <div className="blob-wrapper">
        <div className="blob"></div>
      </div>
      
      <div className="landing-content">
        <h1 className="hero-title">MASTER YOUR <span className="red-text">MATH</span></h1>
        <p className="hero-subtitle">
          Explore interactive flashcards, solve complex equations, and unlock your potential with AI-powered solutions.
        </p>
        
        <div className="landing-buttons">
          <Link to="/sign-up" className="btn-primary">Get Started</Link>
          <Link to="/sign-in" className="btn-secondary">Sign In</Link>
        </div>
      </div>
    </main>
  );
};

export default Landing;