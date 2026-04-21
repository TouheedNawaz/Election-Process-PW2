import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Timeline.css';

const TimelineStep = ({ step, index, total }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="timeline-step">
      <div className="timeline-line-container">
        <div className="timeline-dot">{index + 1}</div>
        {index < total - 1 && <div className="timeline-line"></div>}
      </div>
      
      <div className={`timeline-card card ${isExpanded ? 'expanded' : ''}`} onClick={() => setIsExpanded(!isExpanded)}>
        <div className="timeline-card-header">
          <div>
            <h3 className="timeline-title">{step.title}</h3>
            <span className="timeline-duration">{step.duration}</span>
          </div>
          <button className="expand-btn" aria-label="Toggle details">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        
        {isExpanded && (
          <div className="timeline-details">
            <p className="timeline-description">{step.description}</p>
            <div className="timeline-actions">
              <Link 
                to={`/assistant?q=${encodeURIComponent(`Tell me more about ${step.title} in the election process.`)}`} 
                className="btn btn-ghost timeline-ask-btn"
                onClick={(e) => e.stopPropagation()}
              >
                <HelpCircle size={16} />
                Ask AI about this
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineStep;
