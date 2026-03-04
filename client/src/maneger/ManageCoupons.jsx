import { useState, useEffect } from "react";
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from "../API/CouponController";
import { getAllCategories } from "../API/CategoryController";
import "./ManageCoupons.css";

export default function ManageCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "fixed",
    discountValue: 0,
    validFrom: "",
    validUntil: "",
    clubOnly: false,
    category: "",
    minProductPrice: 0,
    maxProductPrice: "",
    isActive: true,
  });

  useEffect(() => {
    loadCoupons();
    loadCategories();
  }, []);

  const loadCoupons = async () => {
    console.log("Loading coupons...");
    const data = await getAllCoupons();
    console.log("Coupons data:", data);
    if (data) setCoupons(data);
  };

  const loadCategories = async () => {
    const data = await getAllCategories();
    if (data) setCategories(data.categories || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const couponData = {
      ...formData,
      category: formData.category || null,
      maxProductPrice: formData.maxProductPrice || null,
    };

    if (editingCoupon) {
      await updateCoupon(editingCoupon._id, couponData);
    } else {
      await createCoupon(couponData);
    }

    resetForm();
    loadCoupons();
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      validFrom: coupon.validFrom.split("T")[0],
      validUntil: coupon.validUntil.split("T")[0],
      clubOnly: coupon.clubOnly,
      category: coupon.category?._id || "",
      minProductPrice: coupon.minProductPrice,
      maxProductPrice: coupon.maxProductPrice || "",
      isActive: coupon.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("האם למחוק את הקופון?")) {
      await deleteCoupon(id);
      loadCoupons();
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discountType: "fixed",
      discountValue: 0,
      validFrom: "",
      validUntil: "",
      clubOnly: false,
      category: "",
      minProductPrice: 0,
      maxProductPrice: "",
      isActive: true,
    });
    setEditingCoupon(null);
    setShowForm(false);
  };

  return (
    <div className="manage-coupons">
      <h1>ניהול קופונים</h1>

      <button className="add-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "ביטול" : "+ הוסף קופון חדש"}
      </button>

      {showForm && (
        <form className="coupon-form" onSubmit={handleSubmit}>
          <h2>{editingCoupon ? "עריכת קופון" : "קופון חדש"}</h2>
          
          <input
            placeholder="קוד קופון *"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />

          <select
            value={formData.discountType}
            onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
          >
            <option value="fixed">סכום קבוע</option>
            <option value="percentage">אחוזים</option>
          </select>

          <input
            type="number"
            placeholder={formData.discountType === "fixed" ? "סכום הנחה (₪)" : "אחוז הנחה (%)"}
            value={formData.discountValue}
            onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
            required
          />

          <input
            type="date"
            value={formData.validFrom}
            onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
            required
          />

          <input
            type="date"
            value={formData.validUntil}
            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
            required
          />

          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="">כל הקטגוריות</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="מחיר מינימלי"
            value={formData.minProductPrice}
            onChange={(e) => setFormData({ ...formData, minProductPrice: Number(e.target.value) })}
          />

          <input
            type="number"
            placeholder="מחיר מקסימלי (אופציונלי)"
            value={formData.maxProductPrice}
            onChange={(e) => setFormData({ ...formData, maxProductPrice: e.target.value })}
          />

          <label>
            <input
              type="checkbox"
              checked={formData.clubOnly}
              onChange={(e) => setFormData({ ...formData, clubOnly: e.target.checked })}
            />
            רק לחברי מועדון
          </label>

          <label>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
            קופון פעיל
          </label>

          <div className="form-buttons">
            <button type="submit">{editingCoupon ? "עדכן" : "צור קופון"}</button>
            <button type="button" onClick={resetForm}>ביטול</button>
          </div>
        </form>
      )}

      <table className="coupons-table">
        <thead>
          <tr>
            <th>קוד</th>
            <th>הנחה</th>
            <th>תוקף</th>
            <th>קטגוריה</th>
            <th>מועדון</th>
            <th>סטטוס</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon._id}>
              <td>{coupon.code}</td>
              <td>
                {coupon.discountType === "fixed"
                  ? `${coupon.discountValue}₪`
                  : `${coupon.discountValue}%`}
              </td>
              <td>
                {new Date(coupon.validFrom).toLocaleDateString()} - {new Date(coupon.validUntil).toLocaleDateString()}
              </td>
              <td>{coupon.category?.name || "הכל"}</td>
              <td>{coupon.clubOnly ? "כן" : "לא"}</td>
              <td>{coupon.isActive ? "פעיל" : "לא פעיל"}</td>
              <td>
                <button onClick={() => handleEdit(coupon)}>ערוך</button>
                <button onClick={() => handleDelete(coupon._id)}>מחק</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
