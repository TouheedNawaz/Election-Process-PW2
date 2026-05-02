import React, { useState } from 'react';
import SimpleMarkdown from '../components/SimpleMarkdown';
import { Loader2, ArrowLeft } from 'lucide-react';
import { streamChatMessage } from '../services/api';
import '../components/ChatAssistant/Assistant.css';

const SCENARIOS = [
  {
    id: 'lost-id',
    emoji: '🪪',
    title: 'I lost my Voter ID',
    description: 'Get step-by-step guidance to replace a lost or damaged voter ID before elections.',
    prompt: (country) =>
      `I've lost my Voter ID card in ${country}. Give me an exact, numbered, step-by-step action plan to get a replacement as quickly as possible before the next election. Mention the official body, forms, fees, and realistic timelines.`
  },
  {
    id: 'moved-constituency',
    emoji: '🏠',
    title: 'I moved to a new constituency',
    description: 'Learn how to update your voter registration after relocating within the country.',
    prompt: (country) =>
      `I recently moved to a different constituency within ${country}. Give me a clear numbered action plan for how to transfer or update my voter registration so I can vote in my new area.`
  },
  {
    id: 'abroad',
    emoji: '✈️',
    title: "I'm abroad on election day",
    description: 'Explore options for overseas citizens or those travelling during election day.',
    prompt: (country) =>
      `I am a citizen of ${country} currently living or travelling abroad during the election. What are my options to vote? Provide a numbered step-by-step plan with official portals and deadlines.`
  },
  {
    id: 'disabled',
    emoji: '♿',
    title: 'I have a physical disability',
    description: 'Discover accessibility provisions and special assistance available at polling stations.',
    prompt: (country) =>
      `I have a physical disability and want to vote in ${country}. What special provisions, accessibility features, or assistance programs exist for voters with disabilities? Give me a numbered plan for exercising my right to vote.`
  },
  {
    id: 'first-time',
    emoji: '🎓',
    title: 'I am a first-time voter',
    description: 'A complete walkthrough from registration to casting your very first vote.',
    prompt: (country) =>
      `I am a first-time voter in ${country} and have never voted before. Give me a complete numbered step-by-step guide from checking my eligibility all the way to casting my vote on election day. Include registration, what to bring, and what happens at the polling station.`
  },
  {
    id: 'student',
    emoji: '📚',
    title: 'I am a student living away from home',
    description: 'Find out how students studying in a different city can register and vote.',
    prompt: (country) =>
      `I am a student studying in a city different from my home address in ${country}. Can I register to vote where I study? Give me a numbered plan with all the steps and official portals to register and vote from my current location.`
  }
];

const COUNTRIES = [
  { value: 'India', flag: '🇮🇳' },
  { value: 'Pakistan', flag: '🇵🇰' },
  { value: 'Bangladesh', flag: '🇧🇩' }
];

const Scenarios = () => {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScenarioClick = async (scenario) => {
    setSelectedScenario(scenario);
    setResponse('');
    setError(null);
    setIsLoading(true);

    try {
      const prompt = scenario.prompt(selectedCountry);
      await streamChatMessage(prompt, selectedCountry, [], (_token, accumulated) => {
        setResponse(accumulated);
      });
    } catch (err) {
      console.error('Scenario error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedScenario(null);
    setResponse('');
    setError(null);
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    if (selectedScenario) {
      handleScenarioClick(selectedScenario);
    }
  };

  return (
    <div className="scenarios-page">
      {/* Hero */}
      <div className="scenarios-hero">
        <h1>What-If Scenario Guide</h1>
        <p>
          Pick your situation below and get an instant, AI-generated step-by-step resolution plan
          tailored to your country.
        </p>
      </div>

      {/* Country Selector Row */}
      <div className="scenario-country-row">
        <label htmlFor="scenario-country">Country:</label>
        <select
          id="scenario-country"
          className="scenario-country-select"
          value={selectedCountry}
          onChange={handleCountryChange}
        >
          {COUNTRIES.map(c => (
            <option key={c.value} value={c.value}>
              {c.flag} {c.value}
            </option>
          ))}
        </select>
      </div>

      {/* Scenario Cards */}
      <div className="scenarios-grid">
        {SCENARIOS.map(scenario => (
          <button
            key={scenario.id}
            className={`scenario-card ${selectedScenario?.id === scenario.id ? 'active' : ''}`}
            onClick={() => handleScenarioClick(scenario)}
            disabled={isLoading}
          >
            <span className="scenario-card-emoji">{scenario.emoji}</span>
            <h3>{scenario.title}</h3>
            <p>{scenario.description}</p>
          </button>
        ))}
      </div>

      {/* Result Panel */}
      {selectedScenario && (
        <div className="scenario-result-panel">
          <div className="scenario-result-header">
            <span className="scenario-card-emoji">{selectedScenario.emoji}</span>
            <div>
              <h2>{selectedScenario.title}</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                For {selectedCountry}
              </span>
            </div>
          </div>

          {isLoading && !response && (
            <div className="scenario-loading">
              <Loader2 size={32} className="spinner" />
              <span>Generating your personalised guide…</span>
            </div>
          )}

          {error && (
            <p style={{ color: 'var(--accent-red)', fontSize: '0.9rem' }}>{error}</p>
          )}

          {response && (
            <div className="scenario-result-content">
              <SimpleMarkdown className="markdown-body">{response}</SimpleMarkdown>
            </div>
          )}

          <button
            className="btn btn-ghost scenario-reset-btn"
            onClick={handleReset}
          >
            <ArrowLeft size={16} /> Choose a different scenario
          </button>
        </div>
      )}
    </div>
  );
};

export default Scenarios;
