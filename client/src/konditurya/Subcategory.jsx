import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../Redux/productsSlice";
import { Link, useParams } from "react-router-dom";
import "./StyleConditurya.css";

export default function SubCategory() {
  const { categoryId } = useParams();
  const numericCategoryId = Number(categoryId);
  const dispatch = useDispatch();

  const { items: products, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts(numericCategoryId));
  }, [dispatch, numericCategoryId]);

  if (loading) return <div>טוען מוצרים...</div>;
  if (error) return <div>שגיאה: {error}</div>;

  return (
    <>
      <h1 className="main-title">העוגות שלנו</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      ></div>
      <div className="image-gallery">
        {products.length === 0 && <p>אין מוצרים להצגה</p>}

        {products.map((cake) => (
          <div key={cake._id}>
            <Link to={`/cake/${cake.id}`}>
              <img
                src={cake.imageUrl ? `/${cake.imageUrl}` : "/img/default.jpg"}
                className="animated-image"
                alt={cake.name || "cake"}
              />
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
