import "./css.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderById,
  updateOrderPrice,
  updateOrderStatus,
} from "../API/OrderController.js";
import { clearBuyingCart } from "../API/BuyingController.js";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../Redux/cartSlice.js";
import {
  markFirstPurchaseUsed,
  markBirthdayDiscountUsed,
} from "../API/CustomerController.js";
import { validateCoupon } from "../API/CouponController.js";
import { Alert } from "@mui/material";

export default function Tashlum() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [finalPrice, setFinalPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discounts, setDiscounts] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [useCoupon, setUseCoupon] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const delivery = useSelector((state) => state.cart.delivery);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const ord = await getOrderById(orderId);
        if (!ord) throw new Error("Order not found");
        setOrder(ord);

        let price = ord.price + (delivery === "delivery" ? 25 : 0);
        setOriginalPrice(price);
        setFinalPrice(price);
        setDiscounts([]);
      } catch (err) {
        alert(err.message);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId, delivery]);

  const handleCheckCoupon = async () => {
    if (!couponCode.trim()) return setCouponError("יש להזין קוד קופון");

    const products =
      order.products?.map((p) => ({
        categoryId: p.product?.categoryId,
        price: p.product?.price * p.quantity,
      })) || [];

    const result = await validateCoupon(couponCode, products);
    if (result.valid) {
      setUseCoupon(true);
      setCouponError("");
      setDiscounts((prev) => [
        ...prev.filter((d) => d.type !== "coupon"),
        { type: "coupon", amount: result.discount, message: result.message },
      ]);
      setFinalPrice((prev) => Math.max(0, prev - result.discount));
    } else {
      setUseCoupon(false);
      setCouponError(result.message);
    }
  };

  const handleSubmit = async () => {
    try {
      let price = originalPrice;
      const appliedDiscounts = [];

      // מועדון
      const club = await markFirstPurchaseUsed();
      if (club.eligible) {
        const discount = price * 0.1;
        price *= 0.9;
        appliedDiscounts.push({
          type: "club",
          amount: discount,
          message: club.message,
        });
      }

      // יום הולדת
      const birthday = await markBirthdayDiscountUsed();
      if (birthday.eligible) {
        const discount = 25;
        price = Math.max(0, price - discount);
        appliedDiscounts.push({
          type: "birthday",
          amount: discount,
          message: birthday.message,
        });
      }

      // קופון
      if (useCoupon && discounts.some((d) => d.type === "coupon")) {
        const coupon = discounts.find((d) => d.type === "coupon");
        price = Math.max(0, price - coupon.amount);
        appliedDiscounts.push(coupon);
      }

      await updateOrderPrice(orderId, price);
      await updateOrderStatus(orderId, "שולם");
      await clearBuyingCart();
      dispatch(setCart([]));
      navigate(`/OkOrder/${orderId}`);
    } catch (err) {
      console.error(err);
      alert("שגיאה בתשלום");
    }
  };

  if (!order) return <div>טוען...</div>;

  return (
    <div className="payment-container">
      <h2 className="main-title">טופס רכישה מאובטחת</h2>
      <div className="credit-form">
        <input
          placeholder="מספר כרטיס אשראי *"
          className="input-style"
          required
        />
        <div className="credit-details">
          <select className="select-style">
            {[...Array(12)].map((_, i) => (
              <option key={i}>{i + 1}</option>
            ))}
          </select>
          <select className="select-style">
            {[...Array(10)].map((_, i) => (
              <option key={i}>{2025 + i}</option>
            ))}
          </select>
          <input placeholder="3 ספרות בגב הכרטיס *" className="input-style" />
        </div>
        <select className="select-style">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </div>

      <div className="coupon-section">
        <input
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="הזן קוד קופון"
        />
        <button onClick={handleCheckCoupon}>בדוק קופון</button>
        {couponError && <Alert severity="error">{couponError}</Alert>}
        {discounts.find((d) => d.type === "coupon") && (
          <Alert severity="success">
            {discounts.find((d) => d.type === "coupon").message}
          </Alert>
        )}
      </div>

      <div className="total-section">
        {discounts.map((d) => (
          <Alert key={d.type} severity="success">
            {d.message}
          </Alert>
        ))}
        <p style={{ textDecoration: "line-through", color: "#999" }}>
          מחיר לפני הנחה: ₪ {originalPrice.toFixed(2)}
        </p>
        <p style={{ fontWeight: "bold", color: "#4caf50" }}>
          מחיר לאחר הנחה: ₪ {finalPrice.toFixed(2)}
        </p>
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        אישור
      </button>
    </div>
  );
}
