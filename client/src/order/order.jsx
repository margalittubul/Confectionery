import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams, Link } from "react-router-dom";
import { fetchOrders } from "../Redux/ordersSlice";
import { advanceOrderStatus } from "../API/OrderController";
import "./order.css";

export default function Order() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");

  const {
    list: allOrders,
    loading,
    error,
  } = useSelector((state) => state.orders);

  const userRole = useSelector((state) => state.user?.role);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const myOrder = useMemo(() => {
    if (!customerId) return allOrders;
    return allOrders.filter((order) => order.customerId === customerId);
  }, [allOrders, customerId]);

  const handleAdvance = async (orderId) => {
    try {
      await advanceOrderStatus(orderId);
      dispatch(fetchOrders());
    } catch {
      alert("שגיאה");
    }
  };

  if (loading) return <div>...טוען הזמנות</div>;
  if (error) return <div>שגיאה: {error}</div>;

  return (
    <div className="orders-container">
      {myOrder.length === 0 ? (
        <p>אין הזמנות להצגה</p>
      ) : (
        myOrder.map((order) => (
          <div className="order-item" key={order._id}>
            <h3>
              תאריך: {new Date(order.orderDate).toLocaleDateString("he-IL")}
            </h3>
            <p>סכום: {order.price} ש&quot;ח</p>
            <p> סטטוס הזמנה: {order.status} </p>
            <Link to={`/order-details/${order._id}`} className="order-link">
              <button className="details-btn">פרטי הזמנה</button>
            </Link>
            {userRole === "admin" && (order.status === "אושרה הזמנה" || order.status === "בתהליך...") && (
              <button onClick={() => handleAdvance(order._id)} style={{marginRight:"8px",marginTop:"8px",padding:"8px 16px",backgroundColor:"#4caf50",color:"white",border:"none",borderRadius:"5px",cursor:"pointer"}}>
                {order.status === "אושרה הזמנה" ? "התחל בתהליך" : "סמן כנשלח"}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
