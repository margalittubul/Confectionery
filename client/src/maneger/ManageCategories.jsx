import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  getAllCategories,
  addCategory,
} from "../API/CategoryController";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await getAllCategories();
    if (data?.categories) setCategories(data.categories);
  };

  const handleAdd = async () => {
    if (!name.trim() || !imageFile) {
      alert("יש למלא שם ולהעלות תמונה");
      return;
    }
    
    const categoryFolder = folderName || name;
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("categoryFolder", categoryFolder);

    try {
      const token = localStorage.getItem("token");
      const uploadRes = await fetch(`http://localhost:3000/categories/upload?categoryFolder=${categoryFolder}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        alert("שגיאה בהעלאת תמונה");
        return;
      }

      const result = await addCategory({ name, imageUrl: uploadData.imageUrl, folderName: categoryFolder });
      if (result) {
        alert("קטגוריה נוספה בהצלחה");
        setName("");
        setImageFile(null);
        setFolderName("");
        loadCategories();
      } else {
        alert("שגיאה בהוספת קטגוריה");
      }
    } catch {
      alert("שגיאה בהעלאת תמונה");
    }
  };

  return (
    <Box sx={{ p: 4, direction: "rtl" }}>
      <Paper sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h5" mb={3}>
          ניהול קטגוריות
        </Typography>
        <Box display="flex" flexDirection="column" gap={2} mb={3}>
          <TextField
            fullWidth
            label="שם קטגוריה"
            value={name}
            onChange={(e) => setName(e.target.value)}
            color="secondary"
          />
          <TextField
            fullWidth
            label="שם תיקייה (אופציונלי)"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            color="secondary"
            helperText="אם לא מוזן, ייוצר לפי שם הקטגוריה"
          />
          <Button variant="outlined" component="label" color="secondary">
            בחר תמונה *
            <input type="file" hidden accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
          </Button>
          {imageFile && <Typography variant="body2">{imageFile.name}</Typography>}
          <Button variant="contained" onClick={handleAdd} sx={{ bgcolor: "#f7b5cd", "&:hover": { bgcolor: "#f48fb1" } }}>
            הוסף
          </Button>
        </Box>
        <List>
          {categories.map((cat) => (
            <ListItem key={cat._id}>
              <ListItemText primary={cat.name} secondary={cat.imageUrl} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
