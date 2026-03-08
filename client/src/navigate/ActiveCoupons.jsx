import { useEffect, useState } from "react";
import { getAllCoupons } from "../API/CouponController";
import "./ActiveCoupons.css";

export default function ActiveCoupons() {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      const data = await getAllCoupons();
      if (data) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const active = data.filter((c) => {
          const from = new Date(c.validFrom);
          const until = new Date(c.validUntil);
          from.setHours(0, 0, 0, 0);
          until.setHours(23, 59, 59, 999);
          return c.isActive && from <= now && until >= now;
        });
        setCoupons(active);
      }
    };
    fetchCoupons();
  }, []);

  return (
    <div className="coupons-container">
      <h1 className="coupons-title">הנחות פעילות</h1>
      <div className="coupons-grid">
        {coupons.map((coupon) => (
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
