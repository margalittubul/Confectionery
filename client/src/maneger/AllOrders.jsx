import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchOrders, updateOrderInList } from "../Redux/ordersSlice";
import { advanceOrderStatus } from "../API/OrderController";
import "../order/order.css";
import BackButton from "./BackButton";

export default function AllOrders() {
  const dispatch = useDispatch();

  const {
    list: allOrders,
    loading,
    error,
  } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleAdvance = async (orderId) => {
    try {
      const updated = await advanceOrderStatus(orderId);
      if (updated) {
        dispatch(updateOrderInList(updated));
      }
    } catch (err) {
      console.error(err);
      alert("שגיאה בעדכון הסטטוס");
    }
  };

  if (loading) return <div>...טוען הזמנות</div>;
  if (error) return <div>שגיאה: {error}</div>;

  return (
    <div style={{ position: "relative" }}>
      <BackButton />
      <h2
        style={{ textAlign: "center", marginBottom: "20px", marginTop: "20px" }}
      >
        כל ההזמנות
      </h2>
      <div className="orders-container">
        {allOrders.length === 0 ? (
          <p>אין הזמנות להצגה</p>
        ) : (
          allOrders.map((order) => (
            <div className="order-item" key={order._id}>
              <h3>
                תאריך: {new Date(order.orderDate).toLocaleDateString("he-IL")}
              </h3>
              <p>סכום: {order.price} ש&quot;ח</p>
              <p>סטטוס הזמנה: {order.status}</p>
              <Link to={`/order-details/${order._id}`} className="order-link">
                <button className="details-btn">פרטי הזמנה</button>
              </Link>
              {(order.status === "אושרה הזמנה" ||
                order.status === "בתהליך...") && (
                <button
                  onClick={() => handleAdvance(order._id)}
                  className="advance-btn"
                >
                  {order.status === "אושרה הזמנה" ? "התחל בתהליך" : "סמן כנשלח"}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
