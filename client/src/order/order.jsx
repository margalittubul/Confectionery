import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchOrders } from '../Redux/ordersSlice';
import './order.css';

export default function Order() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");

  const { list: allOrders, loading, error } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const myOrder = useMemo(() => {
    if (!customerId) return allOrders;
    return allOrders.filter(order => order.customerId === customerId);
  }, [allOrders, customerId]);

  if (loading) return <div>...טוען הזמנות</div>;
  if (error) return <div>שגיאה: {error}</div>;

  return (
    <div className="orders-container">
      {myOrder.length === 0 ? (
        <p>אין הזמנות להצגה</p>
      ) : (
        myOrder.map(order => (
          <div className="order-item" key={order._id}>
            <h3>תאריך: {new Date(order.orderDate).toLocaleDateString('he-IL')}</h3>
            <p>סכום: {order.price} ש"ח</p>
            <Link to={`/order-details/${order._id}`} className="order-link">
              <button className="details-btn">פרטי הזמנה</button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
