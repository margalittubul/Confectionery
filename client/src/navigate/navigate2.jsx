import { Link } from "react-router-dom";
import "./StyleNavigate.css";
export default function Navigate2() {
  return (
    <>
      <div className="ground">
        <footer>
          <div className="footer-grid">
            <div>
              <Link to="/CakeChallenge">
                <img className="li" src="/img/game.jpg" alt="משחק" />
              </Link>
            </div>
            <div></div>
            <div className="footer-column">
              <strong className="footer-title">יצירת קשר</strong>
              <Link to="/contact">צור קשר</Link>
              <Link to="/ClubJoin">מועדון</Link>
            </div>
            <div className="footer-column">
              <strong className="footer-title">אודות</strong>
              <Link to="/about">אודות</Link>
              <Link to="/articles">תקנון ותנאי שימוש</Link>
              <Link to="/snifim">סניפים</Link>
            </div>
            <div className="footer-column">
              <strong className="footer-title">הזמנות</strong>
              <Link to="/order">הזמנות</Link>
              <Link to="/buying">סל שלי</Link>
            </div>
            <div className="footer-column">
              <strong className="footer-title">קונדיטוריה</strong>
              <Link to="/Category">קונדיטוריה</Link>
              <Link to={`/SubCategory/${1}`}>עוגות חלביות</Link>
              <Link to={`/SubCategory/${2}`}>עוגות פרווה</Link>
              <Link to={`/SubCategory/${3}`}>עוגות אירועים</Link>
              <Link to={`/SubCategory/${5}`}>עוגיות</Link>
              <Link to={`/SubCategory/${4}`}>מארזים</Link>
            </div>
            <div className="footer-column">
              <strong className="footer-title">חשבון</strong>
              <Link to="/login">התחברות</Link>
              <Link to="/">כניסה</Link>
              <Link to="/manager">מנהל</Link>
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
