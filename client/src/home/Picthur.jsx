import "./StyleHome.css";
import img1 from "/img/1.jpg";
import img2 from "/img/2.jpg";
import img3 from "/img/3.jpg";
import img4 from "/img/4.jpg";

import img87 from "/img/chalavi/9.jpg";
import img15 from "/img/chalavi/15.jpg";
import img25 from "/img/parve/9.jpg";
import img50 from "/img/parve/6.jpg";
import img65 from "/img/cokies/15.jpg";
import img76 from "/img/maharazim/11.jpg";
import img49 from "/img/eruaim/21.jpg";
import img23 from "/img/parve/7.jpg";

import img5 from "/img/31.jpg";
import img6 from "/img/32.jpg";
import img7 from "/img/34.jpg";
import img8 from "/img/35.jpg";
import img9 from "/img/36.jpg";
import img10 from "/img/37.jpg";
import img11 from "/img/38.jpg";
import img12 from "/img/39.jpg";
import img13 from "/img/40.jpg";
import img14 from "/img/41.jpg";
import { useState, useEffect, useMemo } from "react";
import { getAllCoupons } from "../API/CouponController";

export default function Picthur() {
  const imageSets = useMemo(
    () => [
      [img1, img2, img3],
      [img4, img87, img15],
      [img25, img50, img65],
      [img76, img49, img23],
    ],
    [],
  );

  const [currentIndices, setCurrentIndices] = useState([0, 0, 0, 0]);
  const [activeCoupons, setActiveCoupons] = useState([]);
  const [displayItems, setDisplayItems] = useState([]);
  const [couponPosition, setCouponPosition] = useState(0);
  const [currentCouponIndex, setCurrentCouponIndex] = useState(0);
  const [showCoupon, setShowCoupon] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      const coupons = await getAllCoupons();
      if (coupons) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const active = coupons.filter((c) => {
          const from = new Date(c.validFrom);
          const until = new Date(c.validUntil);
          from.setHours(0, 0, 0, 0);
          until.setHours(23, 59, 59, 999);
          return (
            c.isActive &&
            from <= now &&
            until >= now &&
            c.description &&
            c.description.trim() !== ""
          );
        });
        setActiveCoupons(active);
      }
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    const items = [];
    imageSets.forEach((set, i) => {
      items.push({ type: "image", data: set, index: i });
    });
    setDisplayItems(items);
  }, [imageSets]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndices((prevIndices) =>
        prevIndices.map((index, i) => {
          const randomIndex = Math.floor(Math.random() * imageSets[i].length);
          return randomIndex;
        }),
      );

      if (activeCoupons.length > 0) {
        setShowCoupon((prev) => !prev);
        setCouponPosition(Math.floor(Math.random() * 4));
        setCurrentCouponIndex(Math.floor(Math.random() * activeCoupons.length));
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [imageSets, activeCoupons]);

  return (
    <>
      <br />
      <br />

      <div className="four-images-gallery">
        {displayItems.map((item, index) => {
          const shouldShowCoupon =
            activeCoupons.length > 0 && index === couponPosition && showCoupon;

          return shouldShowCoupon ? (
            <div
              key={`coupon-${index}`}
              className={`four-image coupon-card active-${index}`}
            >
              <div className="coupon-emoji">🎫</div>
              <div className="coupon-code">
                {activeCoupons[currentCouponIndex].code}
              </div>
              <div className="coupon-description">
                {activeCoupons[currentCouponIndex].description}
              </div>
              <div className="coupon-discount">
                {activeCoupons[currentCouponIndex].discountType === "fixed"
                  ? `${activeCoupons[currentCouponIndex].discountValue}₪`
                  : `${activeCoupons[currentCouponIndex].discountValue}%`}{" "}
                הנחה
              </div>
            </div>
          ) : (
            <img
              key={`img-${index}`}
              src={item.data[currentIndices[item.index]]}
              alt={`gallery-image-${index + 1}`}
              className={`four-image active-${index}`}
            />
          );
        })}
      </div>

      <br />
      <br />
      <br />
      <br />
      <br />
      <div>
        <h2 className="testimonials_h2">...מה הלקוחות שלנו אומרים</h2>
        <img src={img5} className="img2" alt="testimonial 1" />
        <br />
        <img src={img6} className="img" alt="testimonial 2" />
        <br />
        <img src={img7} className="img2" alt="testimonial 3" />
        <br />
        <img src={img8} className="img" alt="testimonial 4" />
        <br />
        <img src={img9} className="img2" alt="testimonial 5" />
        <br />
        <img src={img10} className="img" alt="testimonial 6" />
        <br />
        <img src={img11} className="img2" alt="testimonial 7" />
        <br />
        <img src={img12} className="img" alt="testimonial 8" />
        <br />
        <img src={img13} className="img2" alt="testimonial 9" />
        <br />
        <img src={img14} className="img" alt="testimonial 10" />
      </div>
    </>
  );
}
