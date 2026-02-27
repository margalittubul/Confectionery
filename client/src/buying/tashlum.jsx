import "./css.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById, updateOrderStatus, updateOrderPrice } from "../API/OrderController.js";
import { clearBuyingCart } from "../API/BuyingController.js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../Redux/cartSlice.js";
import { getCustomerProfile, markFirstPurchaseUsed, markBirthdayDiscountUsed } from "../API/CustomerController.js";
import { Alert } from "@mui/material";

export default function Tashlum() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [finalPrice, setFinalPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [hasBirthdayDiscount, setHasBirthdayDiscount] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const delivery = useSelector((state) => state.cart.delivery);

  useEffect(() => {
    setOrder(null);
    setError(null);
    setFinalPrice(0);
    setOriginalPrice(0);
    setHasDiscount(false);
    setHasBirthdayDiscount(false);
    setUserProfile(null);
    
    const fetchOrder = async () => {
      try {
        const ord = await getOrderById(orderId);
        if (!ord) throw new Error("Order not found");
        setOrder(ord);
        
        const profile = await getCustomerProfile();
        setUserProfile(profile);
        
        let price = ord.price;
        if (delivery === "delivery") {
          price += 25;
        }
        setOriginalPrice(price);
        
        // בדיקת הנחת מועדון 10%
        if (profile && profile.is_club_member && !profile.first_club_purchase_used) {
          setHasDiscount(true);
          price = price * 0.9;
        } else {
          setHasDiscount(false);
        }
        
        // בדיקת יום הולדת - 25 שקל הנחה (שבוע מיום ההולדת)
        if (profile && profile.birth_date) {
          const today = new Date();
          const birthDate = new Date(profile.birth_date);
          const currentYear = today.getFullYear();
          
          const birthdayThisYear = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
          const weekAfterBirthday = new Date(birthdayThisYear);
          weekAfterBirthday.setDate(weekAfterBirthday.getDate() + 7);
          
          const isInBirthdayWeek = today >= birthdayThisYear && today <= weekAfterBirthday;
          const usedThisYear = profile.birthday_discount_used_year === currentYear;
          
          if (isInBirthdayWeek && !usedThisYear) {
            setHasBirthdayDiscount(true);
            price = Math.max(0, price - 25);
          }
        }
        
        setFinalPrice(price);
      } catch (err) {
        setError(err.message);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, delivery]);

  if (error) return <div>שגיאה: {error}</div>;
  if (!order) return <div>טוען...</div>;

  const handleSubmit = async () => {
    try {
      await updateOrderPrice(orderId, finalPrice);
      
      if (hasDiscount) {
        await markFirstPurchaseUsed();
      }
      
      if (hasBirthdayDiscount) {
        await markBirthdayDiscountUsed();
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
          {(hasDiscount || hasBirthdayDiscount) && (
            <>
              <Alert severity="success" sx={{ mb: 2 }}>
                {hasDiscount && "🎉 הנחת מועדון - קנייה ראשונה! 10% הנחה"}
                {hasDiscount && hasBirthdayDiscount && <br />}
                {hasBirthdayDiscount && "🎂 יום הולדת שמח! 25₪ הנחה"}
              </Alert>
              <p style={{ textDecoration: 'line-through', color: '#999' }}>
                מחיר לפני הנחה: ₪ {originalPrice.toFixed(2)}
              </p>
              <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#4caf50' }}>
                מחיר לאחר הנחה: ₪ {finalPrice.toFixed(2)}
              </p>
            </>
          )}
          {!hasDiscount && !hasBirthdayDiscount && <p>סה&quot;כ לתשלום: ₪ {finalPrice}</p>}
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          אישור
        </button>
      </div>
    </>
  );
}
