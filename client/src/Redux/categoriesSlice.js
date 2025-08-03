
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategory
} from "../API/CategoryController";

export const fetchCategories = createAsyncThunk("categories/fetchAll", async () => {
  const data = await getAllCategories();
  return data?.categories || [];
});

export const fetchCategoryById = createAsyncThunk("categories/fetchById", async (id) => {
  return await getCategoryById(id);
});

export const createCategory = createAsyncThunk("categories/create", async (categoryData) => {
  return await addCategory(categoryData);
});

export const editCategory = createAsyncThunk("categories/edit", async ({ id, categoryData }) => {
  return await updateCategory(id, categoryData);
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    selectedCategory: null,
    loading: false,
    error: null,
  },
  reducers: {
    addCategoryToState: (state, action) => {
      state.items.push(action.payload);
    },
    updateCategoryInState: (state, action) => {
      const index = state.items.findIndex(cat => cat._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.selectedCategory = action.payload;
      })

      .addCase(createCategory.fulfilled, (state, action) => {
        if (action.payload) {
          state.items.push(action.payload);
        }
      })

      .addCase(editCategory.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex(cat => cat._id === updated._id);
        if (index !== -1) {
          state.items[index] = updated;
        }
        if (state.selectedCategory && state.selectedCategory._id === updated._id) {
          state.selectedCategory = updated;
        }
      });
  },
});

export const {
  addCategoryToState,
  updateCategoryInState,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
