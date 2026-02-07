import "./Serch.css";
import PropTypes from "prop-types";

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

SearchBar.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
