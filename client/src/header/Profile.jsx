import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getCustomerProfile, updateCustomer } from "../API/CustomerController";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getCustomerProfile();
      if (data) {
        setUser({
          _id: data._id,
          name: data.name || "",
          email: data.email || "",
          address: data.address || "",
          password: "",
        });
      } else {
        setUser(null);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

      // ולידציה
      if (!user.name) {
        setMessage("יש להזין שם");
        setSaving(false);
        return;
      }
      if (!user.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email)) {
        setMessage("יש להזין אימייל תקין");
        setSaving(false);
        return;
      }
      if (!user.address) {
        setMessage("יש להזין כתובת");
        setSaving(false);
        return;
      }
      if (user.password && user.password.length < 4) {
        setMessage("סיסמה חייבת להיות לפחות 4 תווים");
        setSaving(false);
        return;
      }

    try {
      const updatedUser = {
        name: user.name,
        email: user.email,
        address: user.address,
      };
      if (user.password) {
        updatedUser.password = user.password;
      }
      const result = await updateCustomer(user._id, updatedUser);
      if (result) {
        setMessage("✅ הפרטים עודכנו בהצלחה");
        setEditMode(false);
      } else {
        setMessage("❌ העדכון נכשל");
      }
    } catch {
      setMessage("❌ שגיאה בעת העדכון");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    window.dispatchEvent(new Event("user-logged-out"));
    navigate("/");
  };

  if (user === null) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography mt={2}>טוען פרטי משתמש...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 6,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "#fff",
      }}
      dir="rtl"
    >
      <Typography variant="h5" textAlign="center" gutterBottom>
        פרופיל משתמש
      </Typography>

      {!editMode ? (
        <Stack spacing={2} mt={2} alignItems="center">
          <Typography><strong>שם:</strong> {user.name}</Typography>
          <Typography><strong>אימייל:</strong> {user.email}</Typography>
          <Typography><strong>כתובת:</strong> {user.address}</Typography>

          <Stack direction="row" spacing={2} mt={2}>
            <Button variant="outlined" onClick={() => setEditMode(true)}>
              עדכן פרטים
            </Button>
            <Button variant="contained" color="error" onClick={handleLogout}>
              התנתקות
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <Stack spacing={2}>
            <TextField
              label="שם"
              name="name"
              value={user.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="אימייל"
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="כתובת"
              name="address"
              value={user.address}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="סיסמה חדשה (לא חובה)"
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
              fullWidth
            />
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? "שומר..." : "שמור שינויים"}
              </Button>
              <Button variant="outlined" onClick={() => setEditMode(false)}>
                ביטול
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}

      {message && (
        <Typography
          textAlign="center"
          color={message.includes("✅") ? "green" : "error"}
          mt={2}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Profile;
