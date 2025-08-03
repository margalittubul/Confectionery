import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
} from "../API/ProductsController";

export const fetchProducts = createAsyncThunk("products/fetch", async (categoryId) => {
  const data = await getAllProducts(categoryId);
  return data || [];
});

export const fetchProductById = createAsyncThunk("products/fetchById", async (id) => {
  const data = await getProductById(id);
  return data;
});

export const addProductAsync = createAsyncThunk("products/add", async (productData) => {
  const data = await addProduct(productData);
  return data?.product || null; 
});

export const updateProductAsync = createAsyncThunk("products/update", async ({ id, productData }) => {
  const data = await updateProduct(id, productData);
  return data?.product || null;
});

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    selectedProduct: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload.products)
          ? action.payload.products
          : [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "שגיאה לא ידועה";
      })

      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.selectedProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addProductAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.items.push(action.payload);
        }
      })

      .addCase(updateProductAsync.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.items.findIndex(p => p._id === action.payload._id || p.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
          if (state.selectedProduct && (state.selectedProduct._id === action.payload._id || state.selectedProduct.id === action.payload.id)) {
            state.selectedProduct = action.payload;
          }
        }
      });
  },
});

export default productsSlice.reducer;
