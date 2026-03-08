import "./css.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getOrderById,
  updateOrderStatus,
  updateOrderPrice,
} from "../API/OrderController.js";
import { clearBuyingCart } from "../API/BuyingController.js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../Redux/cartSlice.js";
import {
  getCustomerProfile,
  markFirstPurchaseUsed,
  markBirthdayDiscountUsed,
} from "../API/CustomerController.js";
import { validateCoupon } from "../API/CouponController.js";
import { Alert } from "@mui/material";

export default function Tashlum() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [finalPrice, setFinalPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [hasBirthdayDiscount, setHasBirthdayDiscount] = useState(false);
  const [useBirthdayDiscount, setUseBirthdayDiscount] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [useCoupon, setUseCoupon] = useState(false);

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
    setUseBirthdayDiscount(false);
    setCouponCode("");
    setCouponData(null);
    setCouponError("");
    setUseCoupon(false);

    const fetchOrder = async () => {
      try {
        const ord = await getOrderById(orderId);
        if (!ord) throw new Error("Order not found");
        setOrder(ord);

        const profile = await getCustomerProfile();

        let price = ord.price;
        if (delivery === "delivery") {
          price += 25;
        }

        if (
          profile &&
          profile.is_club_member &&
          !profile.first_club_purchase_used
        ) {
          setHasDiscount(true);
          price = price * 0.9;
        }

        if (profile && profile.birth_date) {
          const today = new Date();
          const birthDate = new Date(profile.birth_date);
          const currentYear = today.getFullYear();

          const birthdayThisYear = new Date(
            currentYear,
            birthDate.getMonth(),
            birthDate.getDate(),
          );
          const weekAfterBirthday = new Date(birthdayThisYear);
          weekAfterBirthday.setDate(weekAfterBirthday.getDate() + 7);

          const isInBirthdayWeek =
            today >= birthdayThisYear && today <= weekAfterBirthday;
          const usedThisYear =
            profile.birthday_discount_used_year === currentYear;

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

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, delivery]);

  useEffect(() => {
    let price = originalPrice;

    if (useBirthdayDiscount && hasBirthdayDiscount) {
      price = Math.max(0, price - 25);
    }

    if (useCoupon && couponData) {
      price = Math.max(0, price - couponData.discount);
    }

    setFinalPrice(price);
  }, [
    useBirthdayDiscount,
    hasBirthdayDiscount,
    useCoupon,
    couponData,
    originalPrice,
  ]);

  const handleCheckCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("יש להזין קוד קופון");
      return;
    }

    // מצא קטגוריות מהמוצרים בהזמנה
    const categoryIds =
      order.products?.map((p) => p.product?.category).filter(Boolean) || [];
    const uniqueCategoryId = categoryIds.length > 0 ? categoryIds[0] : null;

    const result = await validateCoupon(
      couponCode,
      originalPrice,
      uniqueCategoryId,
    );

    if (result.valid) {
      setCouponData(result);
      setCouponError("");
      setUseCoupon(true);
    } else {
      setCouponError(result.message);
      setCouponData(null);
      setUseCoupon(false);
    }
  };

  if (error) return <div>שגיאה: {error}</div>;
  if (!order) return <div>טוען...</div>;

  const handleSubmit = async () => {
    try {
      await updateOrderPrice(orderId, finalPrice);

      if (hasDiscount) {
        await markFirstPurchaseUsed();
      }

      if (useBirthdayDiscount && hasBirthdayDiscount) {
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
        <br />

        <div
          className="coupon-section"
          style={{
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
          }}
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

          {couponError && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {couponError}
            </Alert>
          )}

          {couponData && (
            <>
              <Alert severity="success" sx={{ mb: 1 }}>
                {couponData.message}
              </Alert>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={useCoupon}
                  onChange={(e) => setUseCoupon(e.target.checked)}
                />
                <span>השתמש בקופון זה</span>
              </label>
            </>
          )}
        </div>

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

          {(hasDiscount ||
            (hasBirthdayDiscount && useBirthdayDiscount) ||
            (useCoupon && couponData)) && (
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
              <p
                style={{
                  fontSize: "1.2em",
                  fontWeight: "bold",
                  color: "#4caf50",
                }}
              >
                מחיר לאחר הנחה: ₪ {finalPrice.toFixed(2)}
              </p>
            </>
          )}
          {!hasDiscount &&
            !(hasBirthdayDiscount && useBirthdayDiscount) &&
            !useCoupon && <p>סה&quot;כ לתשלום: ₪ {finalPrice}</p>}
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          אישור
        </button>
      </div>
    </>
  );
}
