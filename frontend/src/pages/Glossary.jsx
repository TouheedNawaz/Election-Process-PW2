import React, { useState } from 'react';
import { Search, Info, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { glossaryData } from '../data/glossaryData';
import './Glossary.css';

const Glossary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(glossaryData.map(item => item.category))];

  const filteredData = glossaryData.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="glossary-page container">
      <div className="glossary-header">
        <h1>Civic Glossary</h1>
        <p>Your comprehensive dictionary for South Asian electoral terminology.</p>
        
        <div className="search-bar-container">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search terms like 'EVM', 'MCC' or 'FPTP'..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glossary-search-input"
          />
        </div>

        <div className="category-filters">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="glossary-grid">
        {filteredData.length > 0 ? (
          filteredData.map(item => (
            <div key={item.id} className="glossary-card card">
              <div className="glossary-card-header">
                <h3>{item.term}</h3>
                <span className="category-badge">{item.category}</span>
              </div>
              <p className="pronunciation">{item.pronunciation}</p>
              
              <div className="glossary-definition">
                <p>{item.definition}</p>
              </div>
              
              {item.example && (
                <div className="glossary-example">
                  <Info size={16} className="text-amber" />
                  <p><strong>Example:</strong> {item.example}</p>
                </div>
              )}

              <div className="glossary-countries">
                <strong>Relevant in:</strong> {item.countries.join(', ')}
              </div>

              <div className="glossary-actions">
                <Link 
                  to={`/assistant?q=${encodeURIComponent(`Can you explain ${item.term} in more detail?`)}`}
                  className="btn btn-ghost ask-btn"
                >
                  <HelpCircle size={16} /> Ask AI for more
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No terms found matching your search.</p>
            <button className="btn btn-ghost" onClick={() => {setSearchTerm(''); setActiveCategory('All');}}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Glossary;
