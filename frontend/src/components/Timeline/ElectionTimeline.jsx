import React, { useState } from 'react';
import CountrySelector from './CountrySelector';
import TimelineStep from './TimelineStep';
import { electionData } from '../../data/electionData';
import './Timeline.css';

const ElectionTimeline = () => {
  const [selectedCountryId, setSelectedCountryId] = useState('india');
  
  const countries = Object.values(electionData).map(c => ({ id: c.id, name: c.name, flagUrl: c.flagUrl }));
  const currentData = electionData[selectedCountryId];

  return (
    <div className="election-timeline-container">
      <div className="timeline-header">
        <h2>Interactive Election Timeline</h2>
        <p>Select a country to understand its step-by-step electoral process.</p>
      </div>

      <CountrySelector 
        countries={countries} 
        selectedCountry={selectedCountryId} 
        onSelect={setSelectedCountryId} 
      />

      <div className="country-info-card">
        <div className="info-row">
          <span className="info-label">Electoral Body:</span>
          <span className="info-value">{currentData.body}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Voting System:</span>
          <span className="info-value">{currentData.system}</span>
        </div>
      </div>

      <div className="timeline-steps-container">
        {currentData.steps.map((step, index) => (
          <TimelineStep 
            key={step.id} 
            step={step} 
            index={index} 
            total={currentData.steps.length} 
          />
        ))}
      </div>
    </div>
  );
};

export default ElectionTimeline;
