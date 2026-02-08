import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProductAsync } from "../Redux/productsSlice";
import { fetchCategories } from "../Redux/categoriesSlice";

export default function ProductsList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDelete = async () => {
    if (deleteDialog) {
      await dispatch(deleteProductAsync(deleteDialog._id || deleteDialog.id));
      setDeleteDialog(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchCategory = !selectedCategory || p.categoryId === selectedCategory;
    const matchSearch = !searchTerm || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toString().includes(searchTerm);
    return matchCategory && matchSearch;
  });

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c._id === categoryId || c.id === categoryId);
    return cat?.name || "לא ידוע";
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography mt={2}>טוען מוצרים...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, direction: "rtl" }}>
      <Typography variant="h4" textAlign="center" color="#b94f75" mb={3}>
        רשימת מוצרים ({filteredProducts.length})
      </Typography>
      
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="חיפוש לפי שם או קוד"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          color="secondary"
          sx={{ flex: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }} color="secondary">
          <InputLabel>קטגוריה</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="קטגוריה"
          >
            <MenuItem value="">הכל</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat._id || cat.id} value={cat._id || cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: "#fff0f5" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f7b5cd" }}>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>קוד</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>שם</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>תיאור</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>מחיר</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>קטגוריה</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((p) => (
              <TableRow key={p._id || p.id} hover>
                <TableCell>
                  <Chip label={p.id} color="secondary" size="small" />
                </TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {p.description}
                </TableCell>
                <TableCell>₪{p.price}</TableCell>
                <TableCell>{getCategoryName(p.categoryId)}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => navigate(`/EditProductForm/${p.id}`)}
                    sx={{ color: "#f48fb1" }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => setDeleteDialog(p)}
                    sx={{ color: "#f48fb1" }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
        <DialogTitle>אישור מחיקה</DialogTitle>
        <DialogContent>
          <Typography>
            האם אתה בטוח שברצונך למחוק את המוצר "{deleteDialog?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)} sx={{ color: "#f48fb1" }}>
            ביטול
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{ bgcolor: "#f7b5cd", "&:hover": { bgcolor: "#f48fb1" } }}
          >
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
