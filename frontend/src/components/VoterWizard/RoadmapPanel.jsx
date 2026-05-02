import React, { useState, useEffect } from 'react';
import SimpleMarkdown from '../SimpleMarkdown';
import { Loader2, Map, RefreshCw } from 'lucide-react';
import { generateRoadmap } from '../../services/api';

const RoadmapPanel = ({ answers }) => {
  const [roadmap, setRoadmap] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoadmap = async (currentAnswers) => {
    if (!currentAnswers?.country) return;
    setIsLoading(true);
    setError(null);
    setRoadmap('');
    try {
      const result = await generateRoadmap(currentAnswers);
      // Ensure result is a non-empty string
      if (typeof result === 'string' && result.trim()) {
        setRoadmap(result.trim());
      } else {
        setError('Received an empty response. Please try again.');
      }
    } catch (err) {
      console.error('Roadmap error:', err);
      setError('Could not generate your roadmap right now. Please try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fire once when answers are provided
    if (answers?.country) {
      fetchRoadmap(answers);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — we only want to run once on mount

  return (
    <div className="roadmap-panel">
      <div className="roadmap-panel-header">
        <Map size={18} />
        <span>Your Personal Voter Roadmap</span>
        {!isLoading && (
          <button
            onClick={() => fetchRoadmap(answers)}
            title="Regenerate"
            aria-label="Regenerate roadmap"
            style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--accent-blue)', padding: '2px'
            }}
          >
            <RefreshCw size={14} />
          </button>
        )}
      </div>

      {isLoading && (
        <div className="roadmap-loading">
          <Loader2 size={20} className="spinner" />
          <span>Generating your personalised action plan…</span>
        </div>
      )}

      {error && !isLoading && (
        <p style={{ color: 'var(--accent-red)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
          {error}
        </p>
      )}

      {roadmap && !isLoading && (
        <div className="roadmap-content">
          <SimpleMarkdown className="markdown-body">{roadmap}</SimpleMarkdown>
        </div>
      )}
    </div>
  );
};

export default RoadmapPanel;
