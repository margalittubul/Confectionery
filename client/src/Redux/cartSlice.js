import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { addProductToBuying as apiAddProductToBuying } from '../API/BuyingController.js';

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
  'cart/addProductToBuying', // שם הפעולה 
  async ({ productId, quantity }, thunkAPI) => {
    const response = await apiAddProductToBuying(productId, quantity);
    return response;
  }
);

const cartSlice = createSlice({
  name: 'cart',  
  initialState, // מגדיר את המצב ההתחלתי של הסל

  reducers: {
    // עדכון רשימת הפריטים בסל
    setCart(state, action) {
      state.items = action.payload;
    },
    // הוספת מוצר לסל או עדכון הכמות אם הוא כבר קיים
    addToCart(state, action) {
      const item = action.payload; 
      const existing = state.items.find(i => i.productId === item.productId);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
    },
    // הסרת מוצר מהסל לפי productId
    removeFromCart(state, action) {
      state.items = state.items.filter(i => i.productId !== action.payload);
    },
    // עדכון הכמות של מוצר ספציפי
    updateQty(state, action) {
      const { productId, quantity } = action.payload; 
      const item = state.items.find(i => i.productId === productId);
      if (item) item.quantity = quantity;
    },
    // ניקוי מלא של הסל - מחזיר את כל השדות למצב התחלתי
    clearCart(state) {
      state.items = [];
      state.productsDetails = [];
      state.totalPrice = 0;
      state.delivery = null;
      state.orderCreated = null;
    },
    // עדכון פרטי המוצרים בסל (כמו שם, מחיר, תמונה) מה-API
    setProductsDetails(state, action) {
      state.productsDetails = action.payload;
    },
    // עדכון סכום המחיר הכולל
    setTotalPrice(state, action) {
      state.totalPrice = action.payload;
    },
    // עדכון סוג המשלוח
    setDelivery(state, action) {
      state.delivery = action.payload;
    },
    // עדכון פרטי הזמנה שנוצרה לאחר תשלום
    setOrderCreated(state, action) {
      state.orderCreated = action.payload;
    },
    // עדכון מצב הטעינה (Loader)
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },

  // extraReducers - לטיפול באירועים אסינכרוניים שנוצרו ב-createAsyncThunk
  //מגדיר את הסטטוס ההתחלתי
  extraReducers: builder => {
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
  }
});

// יצוא הפעולות 
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

// יצוא ה-reducer כדי להשתמש ב-store
export default cartSlice.reducer;
