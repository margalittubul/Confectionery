import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

import { useDispatch, useSelector } from "react-redux";
import { addProductToBuying } from "../Redux/cartSlice.js";
import { fetchProductById } from "../Redux/productsSlice.js";

export default function Cake() {
  const { cakeId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const {
    items: products,
    selectedProduct,
    loading,
    error,
  } = useSelector((state) => state.products);

  // חיפוש המוצר ב-Redux
  const cake = products.find((p) => p.id === Number(cakeId)) || selectedProduct;

  useEffect(() => {
    if (!cake && !loading) {
      dispatch(fetchProductById(cakeId));
    }
  }, [cakeId, dispatch, loading]);

  const handleAddToCart = () => {
    if (!cake) return;
    if (!user.token) {
      alert("עליך להירשם כדי להוסיף מוצרים לסל");
      navigate("/Login");
      return;
    }
    dispatch(addProductToBuying({ productId: cake.id, quantity: 1 }))
      .unwrap()
      .then(() => {
        alert("המוצר נוסף לסל בהצלחה!");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("שגיאה בהוספת המוצר לסל. אנא נסה שוב.");
      });
  };

  if (loading) return <div>טוען פרטי עוגה...</div>;
  if (error) return <div>שגיאה: {error}</div>;
  if (!cake) return <div>טוען פרטי עוגה...</div>;

  return (
    <div className="StyleCake">
      <h2 className="main-title">{cake.name}</h2>
      <img
        src={cake.imageUrl?.startsWith('http') ? cake.imageUrl : `/${cake.imageUrl}`}
        alt={cake.name}
        className="animated-image"
      />
      <p>{cake.description}</p>
      <p>מחיר: {cake.price} ש&quot;ח</p>
      <IconButton color="primary" onClick={handleAddToCart}>
        <AddShoppingCartIcon />
      </IconButton>
      <br />
    </div>
  );
}
