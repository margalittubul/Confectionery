import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function SearchResults({ cakes }) {
  return (
    <div className="cakes-grid">
      {cakes.length ? (
        cakes.map((cake) => (
          <Link to={`/cake/${cake.id}`} key={cake.id}>
            <div className="cake-item">
              <img
                src={cake.imageUrl}
                alt={cake.name}
                className="animated-image"
              />
              <p>{cake.name}</p>
            </div>
          </Link>
        ))
      ) : (
        <p>לא נמצאו עוגות מתאימות לחיפוש.</p>
      )}
    </div>
  );
}

SearchResults.propTypes = {
  cakes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
    }),
  ).isRequired,
};

export default SearchResults;
