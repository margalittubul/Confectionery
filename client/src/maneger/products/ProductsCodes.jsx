import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../Redux/productsSlice";
import BackButton from "../BackButton";

export default function ProductsCodes() {
  const dispatch = useDispatch();
  const { items: products } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toString().includes(searchTerm),
  );

  return (
    <Box
      sx={{
        p: 4,
        direction: "rtl",
        maxWidth: 1000,
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
          mb={3}
          fontWeight="bold"
        >
          קודי מוצרים
        </Typography>

        <TextField
          fullWidth
          label="חיפוש מוצר"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          color="secondary"
          sx={{ mb: 3 }}
        />

        <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f7b5cd" }}>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#fff",
                    textAlign: "right",
                    width: "20%",
                  }}
                >
                  קוד
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#fff",
                    textAlign: "right",
                    width: "50%",
                  }}
                >
                  שם המוצר
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#fff",
                    textAlign: "right",
                    width: "30%",
                  }}
                >
                  מחיר
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((p) => (
                <TableRow
                  key={p.id}
                  hover
                  sx={{ "&:hover": { bgcolor: "#fff3f8" } }}
                >
                  <TableCell sx={{ textAlign: "right" }}>
                    <Chip label={p.id} color="secondary" size="small" />
                  </TableCell>
                  <TableCell sx={{ textAlign: "right", fontWeight: 500 }}>
                    {p.name}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="body2" color="#666" mt={2} textAlign="center">
          סה&quot;כ {filteredProducts.length} מוצרים
        </Typography>
      </Paper>
    </Box>
  );
}
