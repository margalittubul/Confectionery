import "./css.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../API/OrderController.js";
import { clearBuyingCart } from "../API/BuyingController.js";
import { updateOrderStatus } from "../API/OrderController.js";

export default function OkOrder() {
  const { orderId } = useParams();
  const [order, setOrder] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchOrder = async () => {
      try {
        const ord = await getOrderById(orderId);
        if (!ord) throw new Error("Failed to fetch user cart");
        if (!isMounted) return;
        
        setOrder(ord || []);

        // שלח מייל רק אם הסטטוס עדיין לא "אושרה הזמנה"
        if (ord.status !== "אושרה הזמנה") {
          await updateOrderStatus(orderId, "אושרה הזמנה");
        }

        await clearBuyingCart();

        setTimeout(() => {
          if (isMounted) navigate("/Picthur");
        }, 4000);
      } catch (err) {
        if (isMounted) setError(err.message);
      }
    };

    fetchOrder();
    return () => { isMounted = false; };
  }, [orderId, navigate]);

  if (error) return <div>שגיאה: {error}</div>;

  return (
    <>
      <h2 className="main-title">ההזמנה אושרה</h2>
      <p>בסך: {order.price} ש"ח</p>
      <p>בתאריך: {new Date(order.orderDate).toLocaleDateString('he-IL')}</p>
      <p>תגיע תוך שעתיים ממועד ההזמנה</p>
      <p>בתאבון</p>
      <p>🍰😘🍰</p>
      <p>תודה שקניתם ברשת מתוק מהבית</p>
      <p>👍👍👍</p>
    </>
  );
}
