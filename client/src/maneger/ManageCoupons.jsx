import { useState, useEffect } from "react";
import { Box, Paper, Typography, Button, TextField, Select, MenuItem, FormControlLabel, Checkbox } from "@mui/material";
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from "../API/CouponController";
import { getAllCategories } from "../API/CategoryController";
import { ConfirmationNumber, List } from "@mui/icons-material";

export default function ManageCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [view, setView] = useState("menu");
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: "", description: "", discountType: "fixed", discountValue: 0, validFrom: "", validUntil: "",
    clubOnly: false, category: "", minProductPrice: 0, maxProductPrice: "", isActive: true,
  });

  useEffect(() => {
    loadCategories();
    if (view === "list") loadCoupons();
  }, [view]);

  const loadCoupons = async () => {
    const data = await getAllCoupons();
    if (data) setCoupons(data);
  };

  const loadCategories = async () => {
    const data = await getAllCategories();
    if (data) setCategories(data.categories || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const couponData = { ...formData, category: formData.category || null, maxProductPrice: formData.maxProductPrice || null };
    if (editingCoupon) {
      await updateCoupon(editingCoupon._id, couponData);
    } else {
      await createCoupon(couponData);
    }
    resetForm();
    setView("menu");
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code, description: coupon.description || "", discountType: coupon.discountType, discountValue: coupon.discountValue,
      validFrom: coupon.validFrom.split("T")[0], validUntil: coupon.validUntil.split("T")[0],
      clubOnly: coupon.clubOnly, category: coupon.category?._id || "",
      minProductPrice: coupon.minProductPrice, maxProductPrice: coupon.maxProductPrice || "", isActive: coupon.isActive,
    });
    setView("form");
  };

  const handleDelete = async (id) => {
    if (window.confirm("האם למחוק את הקופון?")) {
      await deleteCoupon(id);
      loadCoupons();
    }
  };

  const resetForm = () => {
    setFormData({ code: "", description: "", discountType: "fixed", discountValue: 0, validFrom: "", validUntil: "", clubOnly: false, category: "", minProductPrice: 0, maxProductPrice: "", isActive: true });
    setEditingCoupon(null);
  };

  const actions = [
    { label: "הצגת קופונים", icon: <List fontSize="large" />, click: () => setView("list") },
    { label: "הוספת קופון", icon: <ConfirmationNumber fontSize="large" />, click: () => setView("form") },
  ];

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 4, direction: "rtl" }}>
      <Paper sx={{ p: 4, maxWidth: view === "list" ? 1200 : 600, width: "100%", bgcolor: "#fff0f5", borderRadius: 3 }}>
        <Typography variant="h5" color="#b94f75" textAlign="center" mb={3}>
          ניהול קופונים
        </Typography>

        {view === "menu" && (
          <Box display="grid" gridTemplateColumns="repeat(2,1fr)" gap={2}>
            {actions.map((a) => (
              <Paper
                key={a.label}
                onClick={a.click}
                sx={{
                  p: 2,
                  height: 90,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#f7b5cd",
                  color: "#fff",
                  borderRadius: 2,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#f48fb1", transform: "scale(1.05)" },
                  transition: "0.3s",
                }}
              >
                {a.icon}
                <Typography variant="body2" mt={1}>{a.label}</Typography>
              </Paper>
            ))}
          </Box>
        )}

        {view === "form" && (
          <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2.5}>
            <Typography variant="h6" color="#b94f75" mb={1}>
              {editingCoupon ? "עריכת קופון" : "קופון חדש"}
            </Typography>

            <TextField
              fullWidth
              label="קוד קופון"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
              color="secondary"
            />

            <TextField
              fullWidth
              label="תיאור הקופון"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              color="secondary"
              multiline
              rows={2}
            />

            <Select
              fullWidth
              value={formData.discountType}
              onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
              color="secondary"
            >
              <MenuItem value="fixed">סכום קבוע</MenuItem>
              <MenuItem value="percentage">אחוזים</MenuItem>
            </Select>

            <TextField
              fullWidth
              type="number"
              label={formData.discountType === "fixed" ? "סכום הנחה (₪)" : "אחוז הנחה (%)"}
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
              required
              color="secondary"
            />

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField
                fullWidth
                type="date"
                label="תוקף מ"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
                color="secondary"
              />
              <TextField
                fullWidth
                type="date"
                label="תוקף עד"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
                color="secondary"
              />
            </Box>

            <Select
              fullWidth
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              color="secondary"
            >
              <MenuItem value="">כל הקטגוריות</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
              ))}
            </Select>

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField
                fullWidth
                type="number"
                label="מחיר מינימלי"
                value={formData.minProductPrice}
                onChange={(e) => setFormData({ ...formData, minProductPrice: Number(e.target.value) })}
                color="secondary"
              />
              <TextField
                fullWidth
                type="number"
                label="מחיר מקסימלי"
                value={formData.maxProductPrice}
                onChange={(e) => setFormData({ ...formData, maxProductPrice: e.target.value })}
                color="secondary"
              />
            </Box>

            <Box display="flex" gap={3}>
              <FormControlLabel
                control={<Checkbox checked={formData.clubOnly} onChange={(e) => setFormData({ ...formData, clubOnly: e.target.checked })} color="secondary" />}
                label="רק לחברי מועדון"
              />
              <FormControlLabel
                control={<Checkbox checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} color="secondary" />}
                label="קופון פעיל"
              />
            </Box>

            <Box display="flex" gap={2} mt={2}>
              <Button type="submit" variant="contained" sx={{ flex: 1, bgcolor: "#f7b5cd", "&:hover": { bgcolor: "#f48fb1" } }}>
                {editingCoupon ? "עדכן" : "צור קופון"}
              </Button>
              <Button onClick={() => { resetForm(); setView("menu"); }} variant="outlined" sx={{ flex: 1, color: "#f48fb1", borderColor: "#f48fb1" }}>
                ביטול
              </Button>
            </Box>
          </Box>
        )}

        {view === "list" && (
          <div>
            <table className="coupons-table" style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", backgroundColor: "#fff" }}>
              <thead>
                <tr style={{ backgroundColor: "#fff9e6", color: "#333" }}>
                  <th style={{ padding: "12px", textAlign: "right", border: "1px solid #f0e6d2", fontWeight: "600" }}>קוד</th>
                  <th style={{ padding: "12px", textAlign: "right", border: "1px solid #f0e6d2", fontWeight: "600" }}>הנחה</th>
                  <th style={{ padding: "12px", textAlign: "right", border: "1px solid #f0e6d2", fontWeight: "600" }}>תוקף</th>
                  <th style={{ padding: "12px", textAlign: "right", border: "1px solid #f0e6d2", fontWeight: "600" }}>קטגוריה</th>
                  <th style={{ padding: "12px", textAlign: "right", border: "1px solid #f0e6d2", fontWeight: "600" }}>מועדון</th>
                  <th style={{ padding: "12px", textAlign: "right", border: "1px solid #f0e6d2", fontWeight: "600" }}>סטטוס</th>
                  <th style={{ padding: "12px", textAlign: "right", border: "1px solid #f0e6d2", fontWeight: "600" }}>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon, index) => (
                  <tr key={coupon._id} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#fffef9" }}>
                    <td style={{ padding: "10px", textAlign: "right", border: "1px solid #f0e6d2" }}>{coupon.code}</td>
                    <td style={{ padding: "10px", textAlign: "right", border: "1px solid #f0e6d2" }}>
                      {coupon.discountType === "fixed" ? `${coupon.discountValue}₪` : `${coupon.discountValue}%`}
                    </td>
                    <td style={{ padding: "10px", textAlign: "right", border: "1px solid #f0e6d2" }}>
                      {new Date(coupon.validFrom).toLocaleDateString("he-IL")} - {new Date(coupon.validUntil).toLocaleDateString("he-IL")}
                    </td>
                    <td style={{ padding: "10px", textAlign: "right", border: "1px solid #f0e6d2" }}>{coupon.category?.name || "הכל"}</td>
                    <td style={{ padding: "10px", textAlign: "right", border: "1px solid #f0e6d2" }}>{coupon.clubOnly ? "כן" : "לא"}</td>
                    <td style={{ padding: "10px", textAlign: "right", border: "1px solid #f0e6d2" }}>{coupon.isActive ? "פעיל" : "לא פעיל"}</td>
                    <td style={{ padding: "10px", textAlign: "right", border: "1px solid #f0e6d2" }}>
                      <button onClick={() => handleEdit(coupon)} style={{ marginLeft: "5px", padding: "5px 15px", backgroundColor: "#f7b5cd", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                        ערוך
                      </button>
                      <button onClick={() => handleDelete(coupon._id)} style={{ padding: "5px 15px", backgroundColor: "#f48fb1", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                        מחק
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Paper>
    </Box>
  );
}
