import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../Redux/categoriesSlice";
import { fetchProductById, updateProductAsync } from "../Redux/productsSlice";

export default function EditProduct() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { items: categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories,
  );

  const {
    selectedProduct,
    loading: productLoading,
    error: productError,
  } = useSelector((state) => state.products);

  const [product, setProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedProduct) {
      setProduct({
        ...selectedProduct,
        categoryId:
          selectedProduct.categoryId || selectedProduct.category?._id || "",
      });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    if (!product.name || !product.description || !product.price || !product.categoryId) {
      setMessage("יש למלא את כל השדות");
      setSaving(false);
      return;
    }

    let finalImageUrl = product.imageUrl;

    if (imageFile) {
      const selectedCategory = categories.find(c => (c._id || c.id) == product.categoryId);
      const categoryFolder = selectedCategory?.name || "other";
      
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("categoryFolder", categoryFolder);

      try {
        const token = localStorage.getItem("userToken");
        const uploadRes = await fetch(`http://localhost:3000/products/upload?categoryFolder=${categoryFolder}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
          finalImageUrl = uploadData.imageUrl;
        } else {
          setMessage("שגיאה בהעלאת תמונה");
          setSaving(false);
          return;
        }
      } catch {
        setMessage("שגיאה בהעלאת תמונה");
        setSaving(false);
        return;
      }
    }

    const updatedProduct = {
      name: product.name,
      description: product.description,
      price: Number(product.price),
      imageUrl: finalImageUrl,
      categoryId: product.categoryId,
    };

    try {
      const resultAction = await dispatch(
        updateProductAsync({
          id: product._id || product.id,
          productData: updatedProduct,
        }),
      );

      if (updateProductAsync.fulfilled.match(resultAction)) {
        setMessage("המוצר עודכן בהצלחה");
        setImageFile(null);
      } else {
        setMessage("עדכון המוצר נכשל");
      }
    } catch (err) {
      setMessage("שגיאה בעדכון המוצר");
    } finally {
      setSaving(false);
    }
  };

  if (productLoading || categoriesLoading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography mt={2}>טוען...</Typography>
      </Box>
    );
  }

  if (productError) {
    return (
      <Typography color="error" textAlign="center">
        שגיאה בטעינת מוצר: {productError}
      </Typography>
    );
  }

  if (!product) {
    return (
      <Typography color="error" textAlign="center">
        לא ניתן לטעון את פרטי המוצר
      </Typography>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 500,
        mx: "auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5" textAlign="center">
        עריכת מוצר
      </Typography>

      <TextField
        label="שם"
        name="name"
        value={product.name || ""}
        onChange={handleChange}
        required
        color="secondary"
      />

      <TextField
        label="תיאור"
        name="description"
        value={product.description || ""}
        onChange={handleChange}
        multiline
        rows={3}
        required
        color="secondary"
      />

      <TextField
        label="מחיר"
        name="price"
        type="number"
        value={product.price || ""}
        onChange={handleChange}
        required
        color="secondary"
      />

      <FormControl required color="secondary">
        <InputLabel>קטגוריה</InputLabel>
        <Select
          name="categoryId"
          value={product.categoryId || ""}
          onChange={handleChange}
          label="קטגוריה"
        >
          {categories.map((cat) => (
            <MenuItem key={cat._id || cat.id} value={cat._id || cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="outlined" component="label" color="secondary">
        העלה תמונה חדשה
        <input type="file" hidden accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
      </Button>
      {imageFile && <Typography variant="body2">{imageFile.name}</Typography>}

      <Button type="submit" variant="contained" disabled={saving} sx={{ bgcolor: "#f7b5cd", "&:hover": { bgcolor: "#f48fb1" } }}>
        {saving ? "שומר..." : "שמור שינויים"}
      </Button>

      {message && (
        <Typography
          textAlign="center"
          color={message.includes("בהצלחה") ? "success" : "error"}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
}
