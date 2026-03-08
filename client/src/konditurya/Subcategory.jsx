import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../Redux/productsSlice";
import { Link, useParams } from "react-router-dom";
import { Pagination } from "@mui/material";
import "./StyleConditurya.css";

export default function SubCategory() {
  const { categoryId } = useParams();
  const numericCategoryId = Number(categoryId);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const {
    items: products,
    loading,
    error,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts(numericCategoryId));
  }, [dispatch, numericCategoryId]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        {currentProducts.length === 0 && <p>אין מוצרים להצגה</p>}

        {currentProducts.map((cake) => (
          <div key={cake._id}>
            <p className="title">{cake.name}</p>
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

      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "30px 0",
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="secondary"
            size="large"
          />
        </div>
      )}
    </>
  );
}
