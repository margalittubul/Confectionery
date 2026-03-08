import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { getCategoryById, updateCategory } from "../API/CategoryController";
import BackButton from "./BackButton";

export default function EditCategory() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadCategory = async () => {
      const data = await getCategoryById(id);
      if (data) {
        setCategory(data);
        setName(data.name);
      }
      setLoading(false);
    };
    loadCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    if (!name.trim()) {
      setMessage("יש להזין שם קטגוריה");
      setSaving(false);
      return;
    }

    let finalImageUrl = category.imageUrl;

    if (imageFile) {
      const categoryFolder = category.name;
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
      const result = await updateCategory(id, updatedCategory);
      if (result) {
        setMessage("הקטגוריה עודכנה בהצלחה");
        setImageFile(null);
      } else {
        setMessage("עדכון הקטגוריה נכשל");
      }
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

  if (!category) {
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
