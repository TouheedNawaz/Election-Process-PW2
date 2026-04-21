import React from 'react';
import ElectionTimeline from '../components/Timeline/ElectionTimeline';
import EligibilityWizard from '../components/VoterWizard/EligibilityWizard';
import './Learn.css';

const Learn = () => {
  return (
    <div className="learn-page container">
      <div className="learn-header">
        <h1>Learn the Process</h1>
        <p className="learn-subtitle">
          Understand how democracy functions step-by-step and verify if you are eligible to participate.
        </p>
      </div>

      <div className="learn-content-grid">
        <div className="timeline-section">
          <ElectionTimeline />
        </div>
        
        <div className="wizard-section">
          <div className="sticky-wizard">
            <EligibilityWizard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
