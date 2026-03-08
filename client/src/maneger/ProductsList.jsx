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
import { Edit, Delete, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProductAsync } from "../Redux/productsSlice";
import { fetchCategories } from "../Redux/categoriesSlice";
import BackButton from "./BackButton";

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
    const matchCategory =
      !selectedCategory ||
      String(p.categoryId) === String(selectedCategory) ||
      Number(p.categoryId) === Number(selectedCategory);
    const matchSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toString().includes(searchTerm);
    return matchCategory && matchSearch;
  });

  const getCategoryName = (categoryId) => {
    const cat = categories.find(
      (c) =>
        c._id === categoryId ||
        c.id === categoryId ||
        c.id === Number(categoryId) ||
        c._id === Number(categoryId),
    );
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
    <Box
      sx={{
        p: 4,
        direction: "rtl",
        maxWidth: 1400,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <BackButton />
      <Paper sx={{ p: 3, bgcolor: "#fff0f5", borderRadius: 3 }}>
        <Typography
          variant="h4"
          textAlign="center"
          color="#b94f75"
          mb={4}
          fontWeight="bold"
        >
          ניהול מוצרים
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <TextField
            label="חיפוש לפי שם או קוד"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            color="secondary"
            sx={{ flex: 1, minWidth: 250 }}
            size="small"
          />
          <FormControl sx={{ minWidth: 200 }} color="secondary" size="small">
            <InputLabel>קטגוריה</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="קטגוריה"
            >
              <MenuItem value="">הכל</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id || cat.id} value={cat.id || cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/AddProductForm")}
            sx={{
              bgcolor: "#f7b5cd",
              "&:hover": { bgcolor: "#f48fb1" },
              height: 40,
            }}
          >
            הוסף מוצר
          </Button>
        </Box>

        <Typography variant="body2" color="#666" mb={2}>
          סה&quot;כ {filteredProducts.length} מוצרים
        </Typography>

        <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f7b5cd" }}>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#fff",
                    textAlign: "right",
                    width: "8%",
                  }}
                >
                  קוד
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#fff",
                    textAlign: "right",
                    width: "20%",
                  }}
                >
                  שם
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#fff",
                    textAlign: "right",
                    width: "30%",
                  }}
                >
                  תיאור
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#fff",
                    textAlign: "right",
                    width: "12%",
                  }}
                >
                  מחיר
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#fff",
                    textAlign: "right",
                    width: "15%",
                  }}
                >
                  קטגוריה
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#fff",
                    textAlign: "center",
                    width: "15%",
                  }}
                >
                  פעולות
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((p) => (
                <TableRow
                  key={p._id || p.id}
                  hover
                  sx={{ "&:hover": { bgcolor: "#fff3f8" } }}
                >
                  <TableCell sx={{ textAlign: "right" }}>
                    <Chip label={p.id} color="secondary" size="small" />
                  </TableCell>
                  <TableCell sx={{ textAlign: "right", fontWeight: 500 }}>
                    {p.name}
                  </TableCell>
                  <TableCell sx={{ textAlign: "right", color: "#666" }}>
                    {p.description.length > 50
                      ? p.description.substring(0, 50) + "..."
                      : p.description}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "right",
                      fontWeight: "bold",
                      color: "#b94f75",
                    }}
                  >
                    ₪{p.price}
                  </TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    <Chip
                      label={getCategoryName(p.categoryId)}
                      size="small"
                      variant="outlined"
                      color="secondary"
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
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
      </Paper>

      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
        <DialogTitle sx={{ textAlign: "right" }}>אישור מחיקה</DialogTitle>
        <DialogContent>
          <Typography>
            האם אתה בטוח שברצונך למחוק את המוצר {deleteDialog?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog(null)}
            sx={{ color: "#f48fb1" }}
          >
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
