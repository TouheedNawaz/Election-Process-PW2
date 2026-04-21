import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, MessageSquare, Target, BookA } from 'lucide-react';
import './Home.css';

const Home = () => {
  // Intersection Observer for scroll animations
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      // Pause animation initially until scrolled into view
      statsRef.current.style.animationPlayState = 'paused';
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) observer.unobserve(statsRef.current);
    };
  }, []);

  const civicFacts = [
    "India is the world's largest democracy with nearly 1 billion eligible voters.",
    "The legal voting age in Pakistan is 18 years.",
    "Bangladesh's Election Commission is an independent constitutional body.",
    "EVMs (Electronic Voting Machines) reduce invalid votes to zero.",
    "First-Past-The-Post is the voting system used in India, Pakistan, and Bangladesh.",
    "Democracy thrives on informed participation."
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Understand Your Vote.<br/>Shape Your Future.</h1>
        <p className="hero-subtitle">
          Your trusted, non-partisan guide to election processes, voter eligibility, 
          and democratic systems in South Asia.
        </p>
      </section>

      {/* Navigation Cards */}
      <section className="nav-cards-grid">
        <Link to="/learn" className="nav-card">
          <div className="nav-card-icon icon-blue">
            <BookOpen size={24} />
          </div>
          <h2>Election Timeline</h2>
          <p>Explore the step-by-step process of how elections work, from announcement to results.</p>
        </Link>
        
        <Link to="/assistant" className="nav-card">
          <div className="nav-card-icon icon-emerald">
            <MessageSquare size={24} />
          </div>
          <h2>AI Assistant</h2>
          <p>Have questions about your local elections? Chat with our knowledgeable civic guide.</p>
        </Link>

        <Link to="/quiz" className="nav-card">
          <div className="nav-card-icon icon-amber">
            <Target size={24} />
          </div>
          <h2>Knowledge Quiz</h2>
          <p>Test your understanding of democratic systems, voting laws, and electoral history.</p>
        </Link>

        <Link to="/glossary" className="nav-card">
          <div className="nav-card-icon icon-red">
            <BookA size={24} />
          </div>
          <h2>Civic Glossary</h2>
          <p>Confused by jargon? Look up terms like FPTP, EVM, and Electoral Roll.</p>
        </Link>
      </section>

      {/* Civic Facts Marquee */}
      <section className="marquee-container">
        <div className="marquee-content">
          {/* Double the array to ensure smooth infinite scrolling */}
          {[...civicFacts, ...civicFacts].map((fact, index) => (
            <div key={index} className="fact-item">
              <div className="fact-dot"></div>
              {fact}
            </div>
          ))}
        </div>
      </section>

      {/* Country Stats Section */}
      <section className="stats-section" ref={statsRef}>
        <h2 className="stats-title">Electoral Systems at a Glance</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-country"><img src="https://flagcdn.com/in.svg" alt="India flag" className="country-flag-icon" /> India</span>
            <span className="stat-detail">Election Commission of India (ECI)</span>
            <span className="stat-detail">6-Phase Process</span>
          </div>
          <div className="stat-item">
            <span className="stat-country"><img src="https://flagcdn.com/pk.svg" alt="Pakistan flag" className="country-flag-icon" /> Pakistan</span>
            <span className="stat-detail">Election Commission of Pakistan</span>
            <span className="stat-detail">National & Provincial Assemblies</span>
          </div>
          <div className="stat-item">
            <span className="stat-country"><img src="https://flagcdn.com/bd.svg" alt="Bangladesh flag" className="country-flag-icon" /> Bangladesh</span>
            <span className="stat-detail">EC Bangladesh</span>
            <span className="stat-detail">Jatiya Sangsad System</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
