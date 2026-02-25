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
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await getAllCategories();
    if (data?.categories) setCategories(data.categories);
  };

  const handleAdd = async () => {
    if (!name.trim()) return;
    const result = await addCategory({ name, imageUrl });
    if (result) {
      alert("קטגוריה נוספה בהצלחה");
      setName("");
      setImageUrl("");
      loadCategories();
    } else {
      alert("שגיאה בהוספת קטגוריה");
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
            label="נתיב תמונה"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            color="secondary"
          />
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
