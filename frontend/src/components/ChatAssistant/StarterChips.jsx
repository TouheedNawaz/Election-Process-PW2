import React from 'react';
import './Assistant.css';

const StarterChips = ({ onSelect }) => {
  const chips = [
    "How does voting work in India?",
    "What is the Electoral College?",
    "When is the next election in Bangladesh?",
    "What is FPTP vs PR system?",
    "How do I register to vote in Pakistan?"
  ];

  return (
    <div className="starter-chips">
      {chips.map((chip, index) => (
        <button 
          key={index} 
          className="chip-btn"
          onClick={() => onSelect(chip)}
        >
          {chip}
        </button>
      ))}
    </div>
  );
};

export default StarterChips;
