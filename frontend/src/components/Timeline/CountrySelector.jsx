import React from 'react';
import './Timeline.css';

const CountrySelector = ({ countries, selectedCountry, onSelect }) => {
  return (
    <div className="country-selector">
      {countries.map((country) => (
        <button
          key={country.id}
          className={`country-tab ${selectedCountry === country.id ? 'active' : ''}`}
          onClick={() => onSelect(country.id)}
        >
          {country.flagUrl && <img src={country.flagUrl} alt={`${country.name} flag`} className="country-flag-icon" />}
          {country.name}
        </button>
      ))}
    </div>
  );
};

export default CountrySelector;
