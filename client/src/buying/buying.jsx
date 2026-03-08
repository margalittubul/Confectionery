import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCart,
  setProductsDetails,
  setTotalPrice,
  setOrderCreated,
  setLoading,
  updateQty,
} from "../Redux/cartSlice";

import {
  getBuyingById,
  calculateTotalBuyingPrice,
  removeProductFromBuying,
  updateProductQuantity,
} from "../API/BuyingController";

import { getProductById } from "../API/ProductsController";
import { addOrder } from "../API/OrderController";
import { useNavigate } from "react-router-dom";
import "./css.css";

const Buying = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    items: cartItems,
    productsDetails,
    orderCreated,
    loading,
  } = useSelector((state) => state.cart);

  const fetchCartAndProducts = async () => {
    dispatch(setLoading(true));
    try {
      const cart = await getBuyingById();
      if (!cart) throw new Error("Cart not found");

      dispatch(setCart(cart.products || []));

      const details = await Promise.all(
        cart.products.map((item) => getProductById(item.productId)),
      );
      dispatch(setProductsDetails(details));

      const total = await calculateTotalBuyingPrice();
      dispatch(setTotalPrice(total?.totalPrice ?? 0));
    } catch (err) {
      console.error("Error loading cart:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    dispatch(setOrderCreated(null));
    fetchCartAndProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const baseTotal = cartItems.reduce((sum, item) => {
    const product = productsDetails.find((p) => p.id === item.productId);
    if (!product || !item) return sum;
    return sum + product.price * item.quantity;
  }, 0);

  const increaseQty = async (productId) => {
    const item = cartItems.find((i) => i.productId === productId);
    if (item) {
      const newQty = item.quantity + 1;
      dispatch(updateQty({ productId, quantity: newQty }));
      await updateProductQuantity(productId, newQty);
    }
  };

  const decreaseQty = async (productId) => {
    const item = cartItems.find((i) => i.productId === productId);
    if (item && item.quantity > 1) {
      const newQty = item.quantity - 1;
      dispatch(updateQty({ productId, quantity: newQty }));
      await updateProductQuantity(productId, newQty);
    }
  };

  const removeItem = async (productId) => {
    try {
      const result = await removeProductFromBuying(productId);
      if (result) {
        fetchCartAndProducts();
      } else {
        alert("לא ניתן להסיר את המוצר");
      }
    } catch (err) {
      console.error("שגיאה בהסרת מוצר:", err);
      alert("שגיאה בהסרת מוצר");
    }
  };

  const handleOrder = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return alert("משתמש לא מחובר");
    if (cartItems.length === 0) {
      alert("הסל ריק - אין מוצרים להזמנה");
      return;
    }

    const orderData = {
      products: cartItems,
      orderDate: new Date(),
      status: "ממתין",
      price: baseTotal,
    };

    const result = await addOrder(orderData);
    if (result) {
      dispatch(setOrderCreated(result));
      navigate(`/delivery-choice/${result._id}`);
    } else {
      alert("אירעה שגיאה בביצוע ההזמנה");
    }
  };

  if (loading) return <div>טוען סל...</div>;

  return (
    <div className="cart-container">
      <div className="cart-items">
        <h2>הסל שלי</h2>
        {cartItems.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>הסל ריק</p>
        ) : (
          cartItems.map((item, index) => {
            const product = productsDetails[index];
            if (!product) return null;
            return (
              <div className="cart-item" key={item.productId}>
                <img src={product.imageUrl} alt={product.name} />
                <div className="item-details">
                  <p>{product.name}</p>
                  <p>{product.price} ש&quot;ח</p>
                  <div className="quantity-controls">
                    <button onClick={() => decreaseQty(item.productId)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(item.productId)}>
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.productId)}
                >
                  ×
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="order-summary">
        <h2>סיכום הזמנה</h2>

        <div className="summary-total">
          <strong>סך הכול</strong>
          <strong>{baseTotal} ש&quot;ח</strong>
        </div>

        <br />

        {orderCreated ? (
          <button
            className="checkout-btn"
            onClick={() => navigate(`/delivery-choice/${orderCreated._id}`)}
          >
            המשך להזמנה
          </button>
        ) : (
          <button
            className="checkout-btn"
            onClick={handleOrder}
            disabled={cartItems.length === 0}
          >
            המשך
          </button>
        )}
      </div>
    </div>
  );
};

export default Buying;
