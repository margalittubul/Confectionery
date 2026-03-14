import "./css.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setDelivery } from "../Redux/cartSlice";
import { updateOrderShippingAsync } from "../Redux/ordersSlice";
import { getCustomerProfile } from "../API/CustomerController";

const branches = [
  { id: 1, name: "סניף תל אביב", address: "רחוב הרצל 123, תל אביב" },
  { id: 2, name: "סניף ירושלים", address: "רחוב יפו 45, ירושלים" },
  { id: 3, name: "סניף חיפה", address: "שדרות בן גוריון 78, חיפה" },
];

export default function DeliveryChoice() {
  const { orderId } = useParams();
  const [deliveryType, setDeliveryType] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [deliveryDetails, setDeliveryDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const loadProfile = async () => {
      const profile = await getCustomerProfile();
      if (profile) {
        setDeliveryDetails((prev) => ({
          ...prev,
          fullName: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          address: profile.address || "",
        }));
      }
    };

    loadProfile();
  }, []);

  const handleContinue = async () => {
    if (!deliveryType) {
      alert("יש לבחור שיטת משלוח");
      return;
    }
    if (deliveryType === "pickup" && !selectedBranch) {
      alert("יש לבחור סניף לאיסוף");
      return;
    }
    if (deliveryType === "delivery") {
      if (
        !deliveryDetails.fullName ||
        !deliveryDetails.phone ||
        !deliveryDetails.address
      ) {
        alert("יש למלא את כל השדות הנדרשים");
        return;
      }
    }

    const hasShipping = deliveryType === "delivery";
    const shippingLocation =
      deliveryType === "delivery"
        ? [deliveryDetails.address, deliveryDetails.city]
            .filter(Boolean)
            .join(", ")
        : branches.find((b) => b.id.toString() === selectedBranch)?.name;
    try {
      await dispatch(
        updateOrderShippingAsync({ orderId, hasShipping, shippingLocation }),
      ).unwrap();
    } catch (error) {
      alert("שגיאה בעדכון ההזמנה: " + error);
      return;
    }

    dispatch(setDelivery(deliveryType));
    navigate(`/tashlum/${orderId}`);
  };

  return (
    <div className="payment-container">
      <h2 className="main-title">בחר שיטת משלוח</h2>

      <div className="delivery-options">
        <label
          className={`delivery-card ${deliveryType === "pickup" ? "selected" : ""}`}
        >
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

        <label
          className={`delivery-card ${deliveryType === "delivery" ? "selected" : ""}`}
        >
          <input
            type="radio"
            name="deliveryType"
            value="delivery"
            checked={deliveryType === "delivery"}
            onChange={(e) => setDeliveryType(e.target.value)}
          />
          <div className="delivery-info">
            <h3>משלוח לכתובת</h3>
            <p>+25 ש&quot;ח</p>
          </div>
        </label>
      </div>

      {deliveryType === "pickup" && (
        <div className="branches-container">
          <h3 className="section-title">בחר סניף לאיסוף:</h3>
          <div className="branches-grid">
            {branches.map((branch) => (
              <label
                key={branch.id}
                className={`branch-card ${selectedBranch === branch.id.toString() ? "selected" : ""}`}
              >
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

      {deliveryType === "delivery" && (
        <div className="delivery-form-container">
          <h3 className="section-title">פרטי משלוח:</h3>
          <form className="form-grid">
            <input
              placeholder="שם מלא *"
              className="input-style"
              value={deliveryDetails.fullName}
              onChange={(e) =>
                setDeliveryDetails({
                  ...deliveryDetails,
                  fullName: e.target.value,
                })
              }
              required
            />
            <input
              placeholder="דוא״ל"
              className="input-style"
              value={deliveryDetails.email}
              onChange={(e) =>
                setDeliveryDetails({
                  ...deliveryDetails,
                  email: e.target.value,
                })
              }
            />
            <input
              placeholder="טלפון *"
              className="input-style"
              value={deliveryDetails.phone}
              onChange={(e) =>
                setDeliveryDetails({
                  ...deliveryDetails,
                  phone: e.target.value,
                })
              }
              required
            />
            <input
              placeholder="כתובת *"
              className="input-style"
              value={deliveryDetails.address}
              onChange={(e) =>
                setDeliveryDetails({
                  ...deliveryDetails,
                  address: e.target.value,
                })
              }
              required
            />
            <input
              placeholder="עיר *"
              className="input-style"
              value={deliveryDetails.city}
              onChange={(e) =>
                setDeliveryDetails({ ...deliveryDetails, city: e.target.value })
              }
              required
            />
            <input
              placeholder="מיקוד"
              className="input-style"
              value={deliveryDetails.zipCode}
              onChange={(e) =>
                setDeliveryDetails({
                  ...deliveryDetails,
                  zipCode: e.target.value,
                })
              }
            />
          </form>
        </div>
      )}

      <button className="submit-btn" onClick={handleContinue}>
        המשך לתשלום
      </button>
    </div>
  );
}
