import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../Redux/categoriesSlice";
import { Link } from "react-router-dom";
import "./StyleConditurya.css";

export default function Category() {
  const dispatch = useDispatch();
  const { items: categories, loading, error } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [categories, dispatch]);

  if (loading) return <div>טוען קטגוריות...</div>;
  if (error) return <div>שגיאה: {error}</div>;

  return (
    <div className="image-gallery">
      {categories.length === 0 && <p>אין קטגוריות להצגה</p>}

      {categories.map((categoryItem) => (
        <div key={categoryItem._id} className="category-item">
          <p>{categoryItem.name}</p>
          <Link to={`/SubCategory/${categoryItem.id}`}>
            <img
              src={categoryItem.imageUrl ? categoryItem.imageUrl : "/img/default.jpg"}
              alt={categoryItem.name}
              className="animated-image"
            />
          </Link>
        </div>
      ))}
    </div>
  );
}
