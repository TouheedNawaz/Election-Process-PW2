import React from 'react';
import { Landmark } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Landmark size={24} className="footer-logo-icon" />
          <span className="footer-logo-text">ElectIQ</span>
          <p className="footer-tagline">Empowering voters across South Asia with clear, non-partisan electoral knowledge.</p>
        </div>

        <div className="footer-links">
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="https://eci.gov.in" target="_blank" rel="noreferrer">Election Commission of India</a></li>
              <li><a href="https://ecp.gov.pk" target="_blank" rel="noreferrer">Election Commission of Pakistan</a></li>
              <li><a href="http://www.ecs.gov.bd" target="_blank" rel="noreferrer">Election Commission Bangladesh</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Made with ❤️ for Google Prompt Wars by @AnonyMalist</p>
        <p className="footer-disclaimer">Not affiliated with any government entity. Built for educational purposes.</p>
      </div>
    </footer>
  );
};

export default Footer;
