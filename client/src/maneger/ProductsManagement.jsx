import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { Add, Delete, Edit, List } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchProducts, deleteProductAsync } from "../Redux/productsSlice";

export default function ProductsManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: products } = useSelector((state) => state.products);
  const [showCodes, setShowCodes] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [editDialog, setEditDialog] = useState(false);
  const [editId, setEditId] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = async () => {
    if (deleteId) {
      await dispatch(deleteProductAsync(deleteId));
      setDeleteDialog(false);
      setDeleteId("");
    }
  };

  const handleEdit = () => {
    if (editId) {
      navigate(`/EditProductForm/${editId}`);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toString().includes(searchTerm)
  );

  const actions = [
    {
      label: "הוספת מוצר",
      icon: <Add fontSize="large" />,
      click: () => navigate("/AddProductForm"),
    },
    {
      label: "עדכון מוצר",
      icon: <Edit fontSize="large" />,
      click: () => setEditDialog(true),
    },
    {
      label: "קודי מוצרים",
      icon: <List fontSize="large" />,
      click: () => navigate("/ProductsCodes"),
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
          ניהול מוצרים
        </Typography>
        <Box display="grid" gridTemplateColumns="repeat(3,1fr)" gap={2} mt={3}>
          {actions.map((action) => (
            <Paper
              key={action.label}
              onClick={action.click}
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
              {action.icon}
              <Typography variant="body2">{action.label}</Typography>
            </Paper>
          ))}
        </Box>
      </Paper>

      {/* דיאלוג עדכון מוצר */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "right" }}>עדכון מוצר</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="הזן קוד מוצר לעדכון"
            value={editId}
            onChange={(e) => setEditId(e.target.value)}
            color="secondary"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)} sx={{ color: "#f48fb1" }}>
            ביטול
          </Button>
          <Button
            onClick={handleEdit}
            variant="contained"
            sx={{ bgcolor: "#f7b5cd", "&:hover": { bgcolor: "#f48fb1" } }}
          >
            עדכן
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
