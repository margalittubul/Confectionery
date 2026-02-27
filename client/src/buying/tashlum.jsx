import "./css.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById, updateOrderStatus, updateOrderPrice } from "../API/OrderController.js";
import { clearBuyingCart } from "../API/BuyingController.js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../Redux/cartSlice.js";
import { getCustomerProfile, markFirstPurchaseUsed } from "../API/CustomerController.js";
import { Alert } from "@mui/material";

export default function Tashlum() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [finalPrice, setFinalPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const delivery = useSelector((state) => state.cart.delivery);

  useEffect(() => {
    // איפוס state בכל פעם שמשתנה orderId
    setOrder(null);
    setError(null);
    setFinalPrice(0);
    setOriginalPrice(0);
    setHasDiscount(false);
    setUserProfile(null);
    
    const fetchOrder = async () => {
      try {
        console.log("Fetching order:", orderId);
        const ord = await getOrderById(orderId);
        if (!ord) throw new Error("Order not found");
        console.log("Order data:", ord);
        setOrder(ord);
        
        let price = delivery === "delivery" ? ord.price + 25 : ord.price;
        console.log("Calculated price:", price);
        setOriginalPrice(price);
        
        // בדיקה אם זכאי להנחת מועדון - תמיד שולף מחדש
        const profile = await getCustomerProfile();
        console.log("User profile:", profile);
        setUserProfile(profile);
        
        if (profile && profile.is_club_member && !profile.first_club_purchase_used) {
          console.log("זכאי להנחה!");
          setHasDiscount(true);
          price = price * 0.9; // הנחה של 10%
        } else {
          console.log("לא זכאי להנחה");
          setHasDiscount(false);
        }
        
        console.log("Final price:", price);
        setFinalPrice(price);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchOrder();
  }, [orderId, delivery]);

  if (error) return <div>שגיאה: {error}</div>;
  if (!order) return <div>טוען...</div>;

  const handleSubmit = async () => {
    try {
      console.log("Starting payment process, hasDiscount:", hasDiscount);
      
      // אם היתה הנחה, עדכן מחיר וסמן שימוש
      if (hasDiscount) {
        console.log("Updating order price to:", finalPrice);
        await updateOrderPrice(orderId, finalPrice);
        
        console.log("Marking first purchase as used...");
        await markFirstPurchaseUsed();
      }
      
      await updateOrderStatus(orderId, "שולם");
      await clearBuyingCart();
      dispatch(setCart([]));
      navigate(`/OkOrder/${orderId}`);
    } catch (err) {
      console.error("שגיאה במהלך עדכון הסטטוס:", err);
      alert(`שגיאה בעדכון סטטוס ההזמנה: ${err.message}`);
    }
  };

  return (
    <>
      <div className="payment-container">
        <h2 className="main-title">טופס רכישה מאובטחת</h2>

        <h3 className="main-title">פרטי אשראי</h3>

        <div className="credit-form">
          <input
            placeholder="מספר כרטיס אשראי *"
            className="input-style"
            required
          />
          <div className="credit-details">
            <select className="select-style">
              <option>חודש</option>
              {[...Array(12)].map((_, i) => (
                <option key={i}>{i + 1}</option>
              ))}
            </select>
            <select className="select-style">
              <option>שנה</option>
              {[...Array(10)].map((_, i) => (
                <option key={i}>{2025 + i}</option>
              ))}
            </select>
            <input placeholder="3 ספרות בגב הכרטיס *" className="input-style" />
          </div>
          <select className="select-style">
            <option>מספר תשלומים</option>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="total-section">
          {hasDiscount && (
            <>
              <Alert severity="success" sx={{ mb: 2 }}>
                🎉 הנחת מועדון - קנייה ראשונה! 10% הנחה
              </Alert>
              <p style={{ textDecoration: 'line-through', color: '#999' }}>
                מחיר לפני הנחה: ₪ {originalPrice.toFixed(2)}
              </p>
              <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#4caf50' }}>
                מחיר לאחר הנחה: ₪ {finalPrice.toFixed(2)}
              </p>
            </>
          )}
          {!hasDiscount && <p>סה&quot;כ לתשלום: ₪ {finalPrice}</p>}
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          אישור
        </button>
      </div>
    </>
  );
}
