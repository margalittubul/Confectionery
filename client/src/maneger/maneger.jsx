import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import {
  ShoppingCart,
  PersonSearch,
  Category,
  List,
  LocalOffer,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getCustomerByEmail } from "../API/CustomerController";

export default function Manager() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const [input, setInput] = useState("");

  const handle = async () => {
    const val = input.trim();
    if (!val) return;
    if (open === "orders") {
      try {
        const c = await getCustomerByEmail(val);
        if (!c) return alert("הלקוח לא נמצא");
        navigate(`/Order?customerId=${c._id}`);
      } catch {
        alert("שגיאה");
      }
    }
    setOpen(null);
    setInput("");
  };

  const actions = [
    {
      label: "ניהול מוצרים",
      icon: <List fontSize="large" />,
      click: () => navigate("/ProductsManagement"),
    },
    {
      label: "ניהול קטגוריות",
      icon: <Category fontSize="large" />,
      click: () => navigate("/ManageCategories"),
    },
    {
      label: "ניהול הזמנות",
      icon: <ShoppingCart fontSize="large" />,
      click: () => navigate("/OrdersManagement"),
    },
    {
      label: "ניהול משתמשים",
      icon: <PersonSearch fontSize="large" />,
      click: () => navigate("/UsersManagement"),
    },
    {
      label: "ניהול קופונים",
      icon: <LocalOffer fontSize="large" />,
      click: () => navigate("/ManageCoupons"),
    },
  ];

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", direction: "rtl", p: 4 }}
    >
      <Paper
        sx={{
          p: 4,
          maxWidth: 500,
          width: "100%",
          textAlign: "center",
          bgcolor: "#fff0f5",
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" color="#b94f75">
          ניהול האתר
        </Typography>
        <Box display="grid" gridTemplateColumns="repeat(2,1fr)" gap={2} mt={3}>
          {actions.map((a) => (
            <Paper
              key={a.label}
              onClick={a.click}
              sx={{
                p: 1,
                height: 100,
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
              <Typography variant="body2">{a.label}</Typography>
            </Paper>
          ))}
        </Box>
      </Paper>

      <Dialog open={!!open} onClose={() => setOpen(null)}>
        <DialogTitle>אימייל לקוח</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            color="secondary"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(null)} sx={{ color: "#f48fb1" }}>
            ביטול
          </Button>
          <Button
            onClick={handle}
            variant="contained"
            sx={{ bgcolor: "#f7b5cd", "&:hover": { bgcolor: "#f48fb1" } }}
          >
            אישור
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
