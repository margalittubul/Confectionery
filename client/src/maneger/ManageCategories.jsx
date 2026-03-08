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
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, createCategory } from "../Redux/categoriesSlice";
import BackButton from "./BackButton";

export default function ManageCategories() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: categories } = useSelector((state) => state.categories);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAdd = async () => {
    if (!name.trim() || !imageFile) {
      alert("יש למלא שם ולהעלות תמונה");
      return;
    }

    const categoryFolder = folderName || name;
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const token = localStorage.getItem("userToken");
      console.log("Token:", token ? "exists" : "missing");
      const uploadRes = await fetch(
        `https://confectionery-server-59ew.onrender.com/categories/upload?categoryFolder=${categoryFolder}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );
      console.log("Status:", uploadRes.status);
      const uploadData = await uploadRes.json();
      console.log("Response:", uploadData);
      if (!uploadRes.ok) {
        alert(
          "שגיאה בהעלאת תמונה: " + (uploadData.message || uploadRes.status),
        );
        return;
      }

      const result = await dispatch(
        createCategory({
          name,
          imageUrl: uploadData.imageUrl,
          folderName: categoryFolder,
        }),
      ).unwrap();

      if (result) {
        alert("קטגוריה נוספה בהצלחה");
        setName("");
        setImageFile(null);
        setFolderName("");
      }
    } catch {
      alert("שגיאה בהעלאת תמונה");
    }
  };

  return (
    <Box sx={{ p: 4, direction: "rtl", position: "relative" }}>
      <BackButton />
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
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </Button>
          {imageFile && (
            <Typography variant="body2">{imageFile.name}</Typography>
          )}
          <Button
            variant="contained"
            onClick={handleAdd}
            sx={{ bgcolor: "#f7b5cd", "&:hover": { bgcolor: "#f48fb1" } }}
          >
            הוסף
          </Button>
        </Box>
        <List>
          {categories.map((cat) => (
            <ListItem
              key={cat._id}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => navigate(`/EditCategory/${cat._id}`)}
                >
                  <EditIcon />
                </IconButton>
              }
            >
              <ListItemText primary={cat.name} secondary={cat.imageUrl} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
