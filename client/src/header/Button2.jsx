import "./StyleHeader.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCustomerProfile } from "../API/CustomerController";
import { useSelector } from "react-redux";

export default function Button() {
  const [username, setUsername] = useState("אורח");
  const [isAdmin, setIsAdmin] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);

  const getUserData = async () => {
    const profile = await getCustomerProfile();
    if (profile && profile.name) {
      setUsername(profile.name);
      setIsAdmin(profile.role === "admin");
    } else {
      setUsername("אורח");
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    getUserData();
    const handleLogin = () => getUserData();
    const handleLogout = () => getUserData();

    window.addEventListener("user-logged-in", handleLogin);
    window.addEventListener("user-logged-out", handleLogout);

    return () => {
      window.removeEventListener("user-logged-in", handleLogin);
      window.removeEventListener("user-logged-out", handleLogout);
    };
  }, []);

  return (
    <div className="buttons-container">
      <Link to={`/profile/${username}`} className="link-button2">
        {username}
      </Link>
      <Link to="/" className="link-button2">
        כניסה
      </Link>
      <Link to="/login" className="link-button2">
        התחברות
      </Link>
      <Link to="/buying" className="link-button2" style={{ position: 'relative' }}>
        סל שלי
        {cartItems.length > 0 && (
          <span style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: '#ff8686',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {cartItems.length}
          </span>
        )}
      </Link>
      <Link className="link-button2" to="/search">
        <img
          src="/img/magnifying_glass.jpg"
          height={"25px"}
          width={"25px"}
          alt="חיפוש"
        />
      </Link>
    </div>
  );
}
