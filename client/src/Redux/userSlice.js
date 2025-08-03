import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  name: null,
  role: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.name = action.payload.name;
      state.role = action.payload.role;
    },
    logout(state) {
      state.token = null;
      state.name = null;
      state.role = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
