import { createSlice } from "@reduxjs/toolkit";

// ✅ Try to load token and role from localStorage
const token = localStorage.getItem("token");
const role = localStorage.getItem("role"); // store role separately

const initialState = {
  token: token || null,
  role: role || null, // "ADMIN" or "USER"
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Store both token and role
    setCredentials: (state, action) => {
      const { token, role } = action.payload;

      state.token = token;
      state.role = role;
      state.isAuthenticated = true;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
    },

    // ✅ Logout
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
