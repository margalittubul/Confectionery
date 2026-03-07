import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { ShoppingCart, PersonSearch } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getCustomerByEmail } from "../API/CustomerController";

export default function OrdersManagement() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const handle = async () => {
    const val = input.trim();
    if (!val) return;
    try {
      const c = await getCustomerByEmail(val);
      if (!c) return alert("הלקוח לא נמצא");
      navigate(`/Order?customerId=${c._id}`);
    } catch {
      alert("שגיאה");
    }
    setOpen(false);
    setInput("");
  };

  const actions = [
    {
      label: "כל ההזמנות",
      icon: <ShoppingCart fontSize="large" />,
      click: () => navigate("/AllOrders"),
    },
    {
      label: "הזמנות לפי לקוח",
      icon: <PersonSearch fontSize="large" />,
      click: () => setOpen(true),
    },
  ];

  return (
    <Box sx={{ display: "flex", justifyContent: "center", direction: "rtl", p: 4 }}>
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
          ניהול הזמנות
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

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ textAlign: "right" }}>אימייל לקוח</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            color="secondary"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ color: "#f48fb1" }}>ביטול</Button>
          <Button onClick={handle} variant="contained" sx={{ bgcolor: "#f7b5cd", "&:hover": { bgcolor: "#f48fb1" } }}>
            אישור
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
