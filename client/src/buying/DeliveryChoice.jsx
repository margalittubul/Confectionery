import "./css.css";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setDelivery } from "../Redux/cartSlice";

const branches = [
  { id: 1, name: "סניף תל אביב", address: "רחוב הרצל 123, תל אביב" },
  { id: 2, name: "סניף ירושלים", address: "רחוב יפו 45, ירושלים" },
  { id: 3, name: "סניף חיפה", address: "שדרות בן גוריון 78, חיפה" }
];

export default function DeliveryChoice() {
  const { orderId } = useParams();
  const [deliveryType, setDeliveryType] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleContinue = () => {
    if (!deliveryType) {
      alert("יש לבחור שיטת משלוח");
      return;
    }
    if (deliveryType === "pickup" && !selectedBranch) {
      alert("יש לבחור סניף לאיסוף");
      return;
    }

    dispatch(setDelivery(deliveryType));
    navigate(`/tashlum/${orderId}`);
  };

  return (
    <div className="payment-container">
      <h2 className="main-title">בחר שיטת משלוח</h2>

      <div className="delivery-options">
        <label className={`delivery-card ${deliveryType === "pickup" ? "selected" : ""}`}>
          <input
            type="radio"
            name="deliveryType"
            value="pickup"
            checked={deliveryType === "pickup"}
            onChange={(e) => setDeliveryType(e.target.value)}
          />
          <div className="delivery-info">
            <h3>איסוף עצמי מסניף</h3>
            <p>ללא עלות נוספת</p>
          </div>
        </label>

        <label className={`delivery-card ${deliveryType === "delivery" ? "selected" : ""}`}>
          <input
            type="radio"
            name="deliveryType"
            value="delivery"
            checked={deliveryType === "delivery"}
            onChange={(e) => setDeliveryType(e.target.value)}
          />
          <div className="delivery-info">
            <h3>משלוח לכתובת</h3>
            <p>+25 ש"ח</p>
          </div>
        </label>
      </div>

      {deliveryType === "pickup" && (
        <div className="branches-container">
          <h3 className="section-title">בחר סניף לאיסוף:</h3>
          <div className="branches-grid">
            {branches.map(branch => (
              <label key={branch.id} className={`branch-card ${selectedBranch === branch.id.toString() ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="branch"
                  value={branch.id}
                  checked={selectedBranch === branch.id.toString()}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                />
                <div className="branch-info">
                  <h4>{branch.name}</h4>
                  <p>{branch.address}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      <button className="submit-btn" onClick={handleContinue}>
        המשך לתשלום
      </button>
    </div>
  );
}
