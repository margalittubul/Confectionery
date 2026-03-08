import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

import { getProductById } from "../API/ProductsController.js";
import { useDispatch, useSelector } from "react-redux";
import { addProductToBuying } from "../Redux/cartSlice.js";

export default function Cake() {
  const [cake, setCake] = useState(null);
  const [error, setError] = useState(null);
  const { cakeId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCake() {
      try {
        const data = await getProductById(cakeId);
        setCake(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchCake();
  }, [cakeId]);

  const handleAddToCart = () => {
    if (!cake) return;
    if (!user.token) {
      alert("עליך להירשם כדי להוסיף מוצרים לסל");
      navigate("/Singin");
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

  if (error) return <div>שגיאה: {error}</div>;
  if (!cake) return <div>טוען פרטי עוגה...</div>;

  return (
    <div className="StyleCake">
      <h2 className="main-title">{cake.name}</h2>
      <img
        src={`/${cake.imageUrl}`}
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
