import { Link } from 'react-router-dom';
import React from 'react';

function SearchResults({ cakes }) {
  return (
    <div className="cakes-grid">
      {cakes.length ? (
        cakes.map(cake => (
          <Link to={`/cake/${cake.id}`}>
             <div key={cake.id} className="cake-item">
            <img src={cake.imageUrl} alt={cake.name} className="animated-image" />
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

export default SearchResults;
