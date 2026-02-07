import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { addProductToBuying as apiAddProductToBuying } from "../API/BuyingController.js";

const initialState = {
  items: [],
  productsDetails: [],
  totalPrice: 0,
  delivery: null,
  orderCreated: null,
  loading: false,
  error: null,
};

export const addProductToBuying = createAsyncThunk(
  "cart/addProductToBuying",
  async ({ productId, quantity }) => {
    const response = await apiAddProductToBuying(productId, quantity);
    return response;
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    setCart(state, action) {
      state.items = action.payload;
    },
    addToCart(state, action) {
      const item = action.payload;
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    updateQty(state, action) {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) item.quantity = quantity;
    },
    clearCart(state) {
      state.items = [];
      state.productsDetails = [];
      state.totalPrice = 0;
      state.delivery = null;
      state.orderCreated = null;
    },
    setProductsDetails(state, action) {
      state.productsDetails = action.payload;
    },
    setTotalPrice(state, action) {
      state.totalPrice = action.payload;
    },
    setDelivery(state, action) {
      state.delivery = action.payload;
    },
    setOrderCreated(state, action) {
      state.orderCreated = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(addProductToBuying.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductToBuying.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.items) {
          state.items = action.payload.items;
          state.totalPrice = action.payload.totalPrice || state.totalPrice;
        }
      })
      .addCase(addProductToBuying.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "שגיאה בהוספת מוצר לסל";
      });
  },
});

export const {
  setCart,
  addToCart,
  removeFromCart,
  updateQty,
  clearCart,
  setProductsDetails,
  setTotalPrice,
  setDelivery,
  setOrderCreated,
  setLoading,
} = cartSlice.actions;

export default cartSlice.reducer;
