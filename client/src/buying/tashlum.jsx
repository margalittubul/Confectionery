import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../Redux/cartSlice";
import {
  getOrderById,
  updateOrderPrice,
  updateOrderStatus,
} from "../API/OrderController";
import { clearBuyingCart } from "../API/BuyingController";
import {
  markFirstPurchaseUsed,
  markBirthdayDiscountUsed,
  getCustomerProfile,
} from "../API/CustomerController";
import { validateCoupon } from "../API/CouponController";
import {
  Box,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Alert,
  Typography,
} from "@mui/material";

export default function Tashlum() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const delivery = useSelector((s) => s.cart.delivery);

  const [order, setOrder] = useState(null);
  const [profile, setProfile] = useState(null);
  const [finalPrice, setFinalPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [useBirthday, setUseBirthday] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const ord = await getOrderById(orderId);
      if (!ord) return;
      setOrder(ord);

      let price = ord.price + (delivery === "delivery" ? 25 : 0);
      setOriginalPrice(price);

      const prof = await getCustomerProfile();
      setProfile(prof);

      if (prof?.is_club_member && !prof.first_club_purchase_used) price *= 0.9;
      setFinalPrice(price);
    };
    fetch();
  }, [orderId, delivery]);

  useEffect(() => {
    if (!originalPrice) return;
    let price = originalPrice;
    if (profile?.is_club_member && !profile?.first_club_purchase_used)
      price *= 0.9;
    if (useBirthday) price -= 25;
    if (coupon?.discount) price -= coupon.discount;
    setFinalPrice(Math.max(0, price));
  }, [originalPrice, useBirthday, coupon, profile]);

  const checkCoupon = async () => {
    if (!couponCode.trim()) return setCouponError("יש להזין קוד קופון");
    const products =
      order.products?.map((p) => ({
        categoryId: p.product?.categoryId,
        price: p.product?.price * p.quantity,
      })) || [];
    const res = await validateCoupon(couponCode, products);
    if (res.valid) {
      setCoupon(res);
      setCouponError("");
    } else {
      setCoupon(null);
      setCouponError(res.message);
    }
  };

  const handleSubmit = async () => {
    await updateOrderPrice(orderId, finalPrice);
    if (profile?.is_club_member && !profile?.first_club_purchase_used)
      await markFirstPurchaseUsed();
    if (useBirthday) await markBirthdayDiscountUsed();
    await updateOrderStatus(orderId, "שולם");
    await clearBuyingCart();
    dispatch(setCart([]));
    navigate(`/OkOrder/${orderId}`);
  };

  if (!order) return <Typography>טוען...</Typography>;

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* משלוח */}
      <Alert severity="info">
        משלוח: {delivery === "delivery" ? "₪25" : "ללא עלות"}
      </Alert>

      {/* יום הולדת */}
      {profile?.birth_date && (
        <FormControlLabel
          control={
            <Checkbox
              checked={useBirthday}
              onChange={(e) => setUseBirthday(e.target.checked)}
            />
          }
          label="🎂 השתמש בהנחת יום הולדת (25₪)"
        />
      )}

      {/* הנחת מועדון */}
      {profile?.is_club_member && !profile.first_club_purchase_used && (
        <Alert severity="success">🎉 קנייה ראשונה במועדון: 10% הנחה</Alert>
      )}

      {/* קופון */}
      <Box
        p={1}
        bgcolor="#f9f9f9"
        borderRadius={1}
        display="flex"
        flexDirection="column"
        gap={1}
      >
        <Typography>קוד קופון</Typography>
        <Box display="flex" gap={1}>
          <TextField
            fullWidth
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <Button variant="contained" color="secondary" onClick={checkCoupon}>
            בדוק
          </Button>
        </Box>
        {couponError && <Alert severity="error">{couponError}</Alert>}
        {coupon && <Alert severity="success">{coupon.message}</Alert>}
      </Box>

      {/* סיכום הנחות */}
      {coupon?.discount && (
        <Typography>הנחות קופון הורידו: ₪{coupon.discount}</Typography>
      )}

      {/* פרטי אשראי */}
      <Box display="flex" flexDirection="column" gap={1}>
        <TextField fullWidth placeholder="מספר כרטיס" />
        <TextField fullWidth placeholder="3 ספרות בגב" />
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
      >
        בצע הזמנה
      </Button>

      {/* מחיר סופי */}
      <Typography color="success.main" mt={1} fontWeight="bold">
        {`סה"כ לתשלום: ₪ ${finalPrice.toFixed(2)}`}
      </Typography>
    </Box>
  );
}
