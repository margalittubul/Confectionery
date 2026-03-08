import { useEffect, useState } from "react";
import { getAllCoupons } from "../API/CouponController";
import "./ActiveCoupons.css";

export default function ActiveCoupons() {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      const data = await getAllCoupons();
      console.log("All coupons:", data);
      if (data) {
        const now = new Date();
        console.log("Now:", now);
        data.forEach(c => {
          console.log(`${c.code}: isActive=${c.isActive}, validFrom=${c.validFrom}, validUntil=${c.validUntil}`);
        });
        const active = data.filter(
          (c) =>
            c.isActive &&
            new Date(c.validFrom) <= now &&
            new Date(c.validUntil) >= now,
        );
        console.log("Active coupons:", active);
        setCoupons(active);
      }
    };
    fetchCoupons();
  }, []);

  console.log("Rendering coupons:", coupons.length, coupons);
  
  return (
    <div className="coupons-container">
      <h1 className="coupons-title">הנחות פעילות</h1>
      <div className="coupons-grid">
        {coupons.map((coupon, index) => (
          <div key={coupon._id} className="coupon-card">
            <div className="coupon-icon">🎫</div>
            <div className="coupon-code">{coupon.code}</div>
            <div className="coupon-description">{coupon.description}</div>
            <div className="coupon-discount">
              {coupon.discountType === "fixed"
                ? `${coupon.discountValue}₪`
                : `${coupon.discountValue}%`}{" "}
              הנחה
            </div>
            {coupon.minProductPrice > 0 && (
              <div className="coupon-min">
                מינימום: {coupon.minProductPrice}₪
              </div>
            )}
            <div className="coupon-valid">
              תוקף עד: {new Date(coupon.validUntil).toLocaleDateString("he-IL")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
