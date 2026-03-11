import "./css.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../Redux/cartSlice.js";
import {
  getOrderById,
  updateOrderStatus,
  updateOrderPrice,
} from "../API/OrderController.js";
import { clearBuyingCart } from "../API/BuyingController.js";
import {
  getCustomerProfile,
  markFirstPurchaseUsed,
  markBirthdayDiscountUsed,
} from "../API/CustomerController.js";
import { validateCoupon } from "../API/CouponController.js";
import { Alert } from "@mui/material";

export default function Tashlum() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const delivery = useSelector((state) => state.cart.delivery);

  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  /* eslint-disable no-unused-vars */
  const [profile, setProfile] = useState(null);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [hasBirthdayDiscount, setHasBirthdayDiscount] = useState(false);
  const [useBirthdayDiscount, setUseBirthdayDiscount] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [useCoupon, setUseCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");

  // --- Fetch order and profile ---
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const ord = await getOrderById(orderId);
        if (!ord) throw new Error("Order not found");
        setOrder(ord);

        const prof = await getCustomerProfile();
        setProfile(prof);

        let price = ord.price + (delivery === "delivery" ? 25 : 0);

        // הנחת מועדון ראשונה
        if (prof?.is_club_member && !prof.first_club_purchase_used) {
          setHasDiscount(true);
          price *= 0.9;
        }

        // הנחת יום הולדת
        if (prof?.birth_date) {
          const today = new Date();
          const birthDate = new Date(prof.birth_date);
          const currentYear = today.getFullYear();

          const birthdayThisYear = new Date(
            currentYear,
            birthDate.getMonth(),
            birthDate.getDate()
          );
          const weekAfterBirthday = new Date(birthdayThisYear);
          weekAfterBirthday.setDate(weekAfterBirthday.getDate() + 7);

          const isInBirthdayWeek =
            today >= birthdayThisYear && today <= weekAfterBirthday;
          const usedThisYear = prof.birthday_discount_used_year === currentYear;

          if (isInBirthdayWeek && !usedThisYear) {
            setHasBirthdayDiscount(true);
          }
        }

        setOriginalPrice(price);
        setFinalPrice(price);
      } catch (err) {
        setError(err.message);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId, delivery]);

  // --- Update final price when discounts change ---
  useEffect(() => {
    let price = originalPrice;
    if (hasDiscount) price *= 0.9; // קנייה ראשונה במועדון
    if (useBirthdayDiscount && hasBirthdayDiscount) price -= 25;
    if (useCoupon && couponData?.discount) price -= couponData.discount;
    setFinalPrice(Math.max(0, price));
  }, [
    originalPrice,
    hasDiscount,
    useBirthdayDiscount,
    hasBirthdayDiscount,
    useCoupon,
    couponData,
  ]);

  // --- Coupon validation ---
  const handleCheckCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("יש להזין קוד קופון");
      return;
    }
    const products =
      order.products?.map((p) => ({
        categoryId: p.product?.categoryId,
        price: p.product?.price * p.quantity,
      })) || [];

    const result = await validateCoupon(couponCode, products);
    if (result.valid) {
      setCouponData(result);
      setUseCoupon(true);
      setCouponError("");
    } else {
      setCouponData(null);
      setUseCoupon(false);
      setCouponError(result.message);
    }
  };

  // --- Submit order ---
  const handleSubmit = async () => {
    try {
      await updateOrderPrice(orderId, finalPrice);

      if (hasDiscount) await markFirstPurchaseUsed();
      if (useBirthdayDiscount && hasBirthdayDiscount) await markBirthdayDiscountUsed();

      await updateOrderStatus(orderId, "שולם");
      await clearBuyingCart();
      dispatch(setCart([]));
      navigate(`/OkOrder/${orderId}`);
    } catch (err) {
      console.error("Error submitting order:", err);
      alert(`שגיאה במהלך אישור ההזמנה: ${err.message}`);
    }
  };

  if (error) return <div>שגיאה: {error}</div>;
  if (!order) return <div>טוען...</div>;

  return (
    <div className="payment-container">
      <h2 className="main-title">טופס רכישה מאובטחת</h2>

      {/* פרטי אשראי */}
      <h3 className="main-title">פרטי אשראי</h3>
      <div className="credit-form">
        <input placeholder="מספר כרטיס אשראי *" className="input-style" required />
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
      <br />

      {/* קופון */}
      <div
        className="coupon-section"
        style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}
      >
        <h3 className="main-title">קוד קופון</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            placeholder="הזן קוד קופון"
            className="input-style"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            style={{ flex: 1 }}
          />
          <button
            onClick={handleCheckCoupon}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f7b5cd",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            בדוק קופון
          </button>
        </div>
        {couponError && <Alert severity="error">{couponError}</Alert>}
        {couponData && (
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input type="checkbox" checked={useCoupon} onChange={(e) => setUseCoupon(e.target.checked)} />
            <span>השתמש בקופון זה</span>
          </label>
        )}
      </div>

      {/* הנחות */}
      <div className="total-section">
        {hasBirthdayDiscount && (
          <label className="birthday-checkbox">
            <input
              type="checkbox"
              checked={useBirthdayDiscount}
              onChange={(e) => setUseBirthdayDiscount(e.target.checked)}
            />
            <span>🎂 השתמש בהנחת יום הולדת (25₪)</span>
          </label>
        )}

        {(hasDiscount || (hasBirthdayDiscount && useBirthdayDiscount) || (useCoupon && couponData)) && (
          <>
            <Alert severity="success" sx={{ mb: 2 }}>
              {hasDiscount && "🎉 הנחת מועדון - קנייה ראשונה! 10% הנחה"}
              {hasDiscount && (useBirthdayDiscount || useCoupon) && <br />}
              {useBirthdayDiscount && "🎂 יום הולדת שמח! 25₪ הנחה"}
              {useBirthdayDiscount && useCoupon && <br />}
              {useCoupon && couponData && `🎫 ${couponData.message}`}
            </Alert>
            <p style={{ textDecoration: "line-through", color: "#999" }}>
              מחיר לפני הנחה: ₪ {originalPrice.toFixed(2)}
            </p>
            <p style={{ fontSize: "1.2em", fontWeight: "bold", color: "#4caf50" }}>
              מחיר לאחר הנחה: ₪ {finalPrice.toFixed(2)}
            </p>
          </>
        )}

        {!hasDiscount && !(hasBirthdayDiscount && useBirthdayDiscount) && !useCoupon && (
          <p>סה&quot;כ לתשלום: ₪ {finalPrice}</p>
        )}
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        אישור
      </button>
    </div>
  );
}