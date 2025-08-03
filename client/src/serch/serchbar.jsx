
import React from 'react';
import './Serch.css'

function SearchBar({ query, setQuery, onSearch }) {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="חפש עוגה..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-bar-container input"
      />
      <button onClick={onSearch} className="search-bar-container button">
        חפש
      </button>
    </div>
  );
}

export default SearchBar;
