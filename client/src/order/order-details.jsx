import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById } from '../Redux/ordersSlice';
import { getProductById } from '../API/ProductsController';
import './OrderDetails.css';

export default function OrderDetails() {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  const order = useSelector(state => state.orders.selectedOrder);
  const loading = useSelector(state => state.orders.loading);
  const error = useSelector(state => state.orders.error);

  const [productsDetails, setProductsDetails] = useState([]);

  useEffect(() => {
    dispatch(fetchOrderById(orderId));
  }, [dispatch, orderId]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!order || !order.products) return;

      const productsWithDetails = await Promise.all(
        order.products.map(async (product) => {
          const details = await getProductById(product.productId);
          if (!details) return null;
          return { ...details, quantity: product.quantity };
        })
      );

      setProductsDetails(productsWithDetails.filter(Boolean));//שאין הזמנה שהיא Null
    };

    fetchProducts();
  }, [order]);

  if (error) return <p className="error-message">{error}</p>;
  if (loading || !order) return <p>טוען...</p>;

  return (
    <div className="order-details">
      <h2 className="order-title">פרטי הזמנה</h2>
      {/* ממיר את התאריך לתאריך מקומי */}
      <p className="order-date">תאריך: {new Date(order.orderDate).toLocaleDateString('he-IL')}</p>
      <p className="order-price">סכום: {order.price} ש"ח</p>
      <h3 className="products-title">מוצרים:</h3>
      <ul className="products-list">
        {productsDetails.map((product) => (
          <li className="product-item" key={product._id || product.id}>
            <img
              src={`/${product.imageUrl}`}
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <p className="product-name">{product.name}</p>
              <p className="product-price">{product.price} ש"ח</p>
              <p className="product-quantity">כמות: {product.quantity}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
