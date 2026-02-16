import "./StyleHeader.css";
import { Link } from "react-router-dom";
import logo from "/img/מתוק מהבית .png";

export default function Logo() {
  return (
    <Link to="/Picthur" className="logo-container">
      <img src={logo} className="logo-image" alt="לוגו" />
    </Link>
  );
}
