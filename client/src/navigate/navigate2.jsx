import { Link } from "react-router-dom";
import "./StyleNavigate.css";
import { useState, useEffect } from "react";
import { getCustomerProfile } from "../API/CustomerController";
import ClubJoin from "./ClubJoin";

export default function Navigate2() {
  const [openSection, setOpenSection] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const profile = await getCustomerProfile();
      setIsAdmin(profile?.role === "admin");
    };
    checkAdmin();

    const handleLogin = () => checkAdmin();
    const handleLogout = () => setIsAdmin(false);

    window.addEventListener("user-logged-in", handleLogin);
    window.addEventListener("user-logged-out", handleLogout);

    return () => {
      window.removeEventListener("user-logged-in", handleLogin);
      window.removeEventListener("user-logged-out", handleLogout);
    };
  }, []);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <>
      <div className="ground">
        <footer>
          <div className="footer-wrapper">
            <div className="footer-image">
               <ClubJoin />
            </div>
            <div className="footer-grid">
              <div className="footer-column">
                <strong
                  className="footer-title"
                  onClick={() => toggleSection("contact")}
                >
                  יצירת קשר
                </strong>
                <div
                  className={`footer-links ${openSection === "contact" ? "open" : ""}`}
                >
                  <Link to="/contact">צור קשר</Link>
                  <Link to="/ClubJoin">מועדון</Link>
                </div>
              </div>
              <div className="footer-column">
                <strong
                  className="footer-title"
                  onClick={() => toggleSection("about")}
                >
                  אודות
                </strong>
                <div
                  className={`footer-links ${openSection === "about" ? "open" : ""}`}
                >
                  <Link to="/about">אודות</Link>
                  <Link to="/articles">תקנון ותנאי שימוש</Link>
                  <Link to="/snifim">סניפים</Link>
                </div>
              </div>
              <div className="footer-column">
                <strong
                  className="footer-title"
                  onClick={() => toggleSection("orders")}
                >
                  הזמנות
                </strong>
                <div
                  className={`footer-links ${openSection === "orders" ? "open" : ""}`}
                >
                  <Link to="/order">הזמנות</Link>
                  <Link to="/buying">סל שלי</Link>
                  <Link to="/ActiveCoupons">הנחות פעילות</Link>
                </div>
              </div>
              <div className="footer-column">
                <strong
                  className="footer-title"
                  onClick={() => toggleSection("cakes")}
                >
                  קונדיטוריה
                </strong>
                <div
                  className={`footer-links ${openSection === "cakes" ? "open" : ""}`}
                >
                  <Link to="/Category">קונדיטוריה</Link>
                  <Link to={`/SubCategory/${1}`}>עוגות חלביות</Link>
                  <Link to={`/SubCategory/${2}`}>עוגות פרווה</Link>
                  <Link to={`/SubCategory/${3}`}>עוגות אירועים</Link>
                  <Link to={`/SubCategory/${5}`}>עוגיות</Link>
                  <Link to={`/SubCategory/${4}`}>מארזים</Link>
                </div>
              </div>
              <div className="footer-column">
                <strong
                  className="footer-title"
                  onClick={() => toggleSection("account")}
                >
                  חשבון
                </strong>
                <div
                  className={`footer-links ${openSection === "account" ? "open" : ""}`}
                >
                  <Link to="/login">התחברות</Link>
                  <Link to="/">כניסה</Link>
                  {isAdmin && <Link to="/manager">מנהל</Link>}
                </div>
              </div>
            </div>
          </div>
          <div className="footer-copyright">
            <p>© 2026 מתוק מהבית - כל הזכויות שמורות</p>
          </div>
        </footer>
      </div>
    </>
  );
}
