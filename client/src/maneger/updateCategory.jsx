import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryById, editCategory } from "../Redux/categoriesSlice";
import BackButton from "./BackButton";

export default function EditCategory() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedCategory, loading } = useSelector(
    (state) => state.categories,
  );

  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchCategoryById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedCategory) {
      setName(selectedCategory.name);
    }
  }, [selectedCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    if (!name.trim()) {
      setMessage("יש להזין שם קטגוריה");
      setSaving(false);
      return;
    }

    let finalImageUrl = selectedCategory.imageUrl;

    if (imageFile) {
      const categoryFolder = selectedCategory.name;
      const formData = new FormData();
      formData.append("image", imageFile);

      try {
        const token = localStorage.getItem("userToken");
        const uploadRes = await fetch(
          `http://localhost:3000/categories/upload?categoryFolder=${categoryFolder}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          },
        );
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

    const updatedCategory = {
      name,
      imageUrl: finalImageUrl,
    };

    try {
      await dispatch(
        editCategory({
          id,
          categoryData: updatedCategory,
        }),
      ).unwrap();

      setMessage("הקטגוריה עודכנה בהצלחה");
      setImageFile(null);
    } catch {
      setMessage("שגיאה בעדכון הקטגוריה");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography mt={2}>טוען...</Typography>
      </Box>
    );
  }

  if (!selectedCategory) {
    return (
      <Typography color="error" textAlign="center">
        לא ניתן לטעון את פרטי הקטגוריה
      </Typography>
    );
  }

  return (
    <Box sx={{ position: "relative" }}>
      <BackButton />
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
          עריכת קטגוריה
        </Typography>

        <TextField
          label="שם"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          color="secondary"
        />

        <Button variant="outlined" component="label" color="secondary">
          העלה תמונה חדשה
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </Button>
        {imageFile && <Typography variant="body2">{imageFile.name}</Typography>}

        <Button
          type="submit"
          variant="contained"
          disabled={saving}
          sx={{ bgcolor: "#f7b5cd", "&:hover": { bgcolor: "#f48fb1" } }}
        >
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
    </Box>
  );
}
