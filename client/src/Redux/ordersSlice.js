import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllOrders, getOrderById } from "../API/OrderController";

export const fetchOrders = createAsyncThunk("orders/fetch", async () => {
  const data = await getAllOrders();
  return data || [];
});

export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (orderId) => {
    const data = await getOrderById(orderId);
    return data;
  },
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    selectedOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    updateOrderInList: (state, action) => {
      const index = state.list.findIndex(
        (order) => order._id === action.payload._id,
      );
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.selectedOrder = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateOrderInList } = ordersSlice.actions;
export default ordersSlice.reducer;
