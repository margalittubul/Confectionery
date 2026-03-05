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
import { useState, useEffect } from "react";
import { getAllCoupons } from "../API/CouponController";

export default function Picthur() {
  const imageSets = [
    [img1, img2, img3],
    [img4, img87, img15],
    [img25, img50, img65],
    [img76, img49, img23],
  ];

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
        const active = coupons.filter(c => 
          c.isActive && 
          new Date(c.validFrom) <= now && 
          new Date(c.validUntil) >= now &&
          c.description && c.description.trim() !== ""
        );
        setActiveCoupons(active);
      }
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    const items = [];
    imageSets.forEach((set, i) => {
      items.push({ type: 'image', data: set, index: i });
    });
    setDisplayItems(items);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndices((prevIndices) =>
        prevIndices.map((index, i) => {
          const randomIndex = Math.floor(Math.random() * imageSets[i].length);
          return randomIndex;
        }),
      );
      
      // החלף בין תמונות לקופונים והזז את המיקום
      if (activeCoupons.length > 0) {
        setShowCoupon(prev => !prev);
        setCouponPosition(Math.floor(Math.random() * 4)); // מיקום אקראי 0-3
        setCurrentCouponIndex(Math.floor(Math.random() * activeCoupons.length)); // קופון אקראי
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
          // אם יש קופונים וזה המיקום של הקופון וצריך להציג קופון
          const shouldShowCoupon = activeCoupons.length > 0 && index === couponPosition && showCoupon;
          
          return shouldShowCoupon ? (
            <div 
              key={`coupon-${index}`} 
              className={`four-image active-${index}`}
              style={{
                background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '15px',
                color: '#c2185b',
                textAlign: 'center',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '2px solid #f48fb1',
                boxSizing: 'border-box'
              }}>
              <div style={{ fontSize: '2em', marginBottom: '8px' }}>🎫</div>
              <div style={{ fontSize: '1.4em', fontWeight: 'bold', marginBottom: '8px' }}>{activeCoupons[currentCouponIndex].code}</div>
              <div style={{ fontSize: '0.9em', marginBottom: '10px', lineHeight: '1.3' }}>{activeCoupons[currentCouponIndex].description}</div>
              <div style={{ fontSize: '1.2em', fontWeight: 'bold', backgroundColor: '#f48fb1', color: '#fff', padding: '6px 12px', borderRadius: '15px' }}>
                {activeCoupons[currentCouponIndex].discountType === 'fixed' ? `${activeCoupons[currentCouponIndex].discountValue}₪` : `${activeCoupons[currentCouponIndex].discountValue}%`} הנחה
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
