import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("userToken") || null,
  name: localStorage.getItem("userName") || null,
  role: localStorage.getItem("userRole") || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.name = action.payload.name;
      state.role = action.payload.role;

      localStorage.setItem("userToken", action.payload.token);
      localStorage.setItem("userName", action.payload.name);
      localStorage.setItem("userRole", action.payload.role);
    },
    logout(state) {
      state.token = null;
      state.name = null;
      state.role = null;

      localStorage.removeItem("userToken");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
