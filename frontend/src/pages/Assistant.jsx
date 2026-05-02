import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatWindow from '../components/ChatAssistant/ChatWindow';
import '../components/ChatAssistant/Assistant.css';

const COUNTRIES = [
  { id: '', flag: '🌏', label: 'All' },
  { id: 'India', flag: '🇮🇳', label: 'India' },
  { id: 'Pakistan', flag: '🇵🇰', label: 'Pakistan' },
  { id: 'Bangladesh', flag: '🇧🇩', label: 'Bangladesh' },
];

const SUGGESTED_BY_COUNTRY = {
  '': [
    "How does First-Past-The-Post voting work?",
    "What is the role of an Electoral Commission?",
    "What is a Model Code of Conduct?",
    "How are election results verified?",
    "What is proportional representation?",
  ],
  'India': [
    "How does the ECI schedule a General Election?",
    "What is an Electronic Voting Machine (EVM)?",
    "How do NRIs register to vote in India?",
    "What is the VVPAT system?",
    "How can I check my name on the Electoral Roll?",
  ],
  'Pakistan': [
    "How does the ECP administer elections?",
    "What is the National Assembly vs Provincial Assembly?",
    "How do overseas Pakistanis vote (NICOP)?",
    "What is the role of the Returning Officer?",
    "How are Senate seats allocated in Pakistan?",
  ],
  'Bangladesh': [
    "How does EC Bangladesh manage elections?",
    "What is the Jatiya Sangsad system?",
    "How are parliamentary seats allocated in Bangladesh?",
    "What is the role of the Chief Election Commissioner?",
    "How can Bangladeshi citizens update their voter registration?",
  ],
};

const Assistant = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  const [selectedCountry, setSelectedCountry] = useState('');
  const [externalQuery, setExternalQuery] = useState(query || null);

  const suggestions = SUGGESTED_BY_COUNTRY[selectedCountry] || SUGGESTED_BY_COUNTRY[''];

  const handleSuggestionClick = useCallback((text) => {
    setExternalQuery(text);
  }, []);

  return (
    <div className="assistant-page">
      <div className="assistant-dashboard">

        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside className="assistant-sidebar">

          {/* AI Status Badge */}
          <div className="sidebar-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="ai-badge">
              <div className="ai-badge-dot" />
              Gemini 2.5 Flash · Active
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Politically neutral · Non-partisan · Civic facts only
            </p>
          </div>

          {/* Country Context Selector */}
          <div className="sidebar-card">
            <h3>Country Context</h3>
            <div className="country-selector-grid">
              {COUNTRIES.map(c => (
                <button
                  key={c.id}
                  className={`country-btn ${selectedCountry === c.id ? 'active' : ''}`}
                  onClick={() => setSelectedCountry(c.id)}
                  title={c.label}
                >
                  <span className="country-btn-flag">{c.flag}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="sidebar-card">
            <h3>Try asking…</h3>
            <div className="suggested-questions-list">
              {suggestions.map((q, i) => (
                <button
                  key={i}
                  className="suggested-q-btn"
                  onClick={() => handleSuggestionClick(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Chat Window ─────────────────────────────────────── */}
        <div className="assistant-chat-area">
          <ChatWindow
            initialQuery={externalQuery}
            countryContext={selectedCountry}
          />
        </div>
      </div>
    </div>
  );
};

export default Assistant;
