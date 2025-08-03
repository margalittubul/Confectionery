import { configureStore } from "@reduxjs/toolkit";

import categoriesReducer from "./categoriesSlice";
import productsReducer from "./productsSlice";
import ordersReducer from "./ordersSlice";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    categories: categoriesReducer, 
    products: productsReducer,    
    orders: ordersReducer,         
    cart: cartReducer,             
    user: userReducer,      
  },
});
