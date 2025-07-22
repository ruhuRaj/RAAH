import { createSlice } from "@reduxjs/toolkit";

let parsedUser = null;
try {
  const storedUser = localStorage.getItem("raahUser");
  if (storedUser && storedUser !== "undefined") {
    parsedUser = JSON.parse(storedUser);
  }
} catch (e) {
  console.error("Invalid raahUser in localStorage:", e);
  parsedUser = null;
}

const initialState = {
  user: parsedUser,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const user = { ...action.payload };

      // Ensure user is serializable
      Object.keys(user).forEach((key) => {
        if (typeof user[key] === 'function') {
          delete user[key];
        }
      });

      state.user = user;
      try {
        if (user) {
          localStorage.setItem("raahUser", JSON.stringify(user));
          localStorage.setItem("raahAccountType", user.accountType);
        } else {
          localStorage.removeItem("raahUser");
          localStorage.removeItem("raahAccountType");
        }
      } catch (err) {
        console.error("Error saving user to localStorage:", err);
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearProfile: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("raahUser");
      localStorage.removeItem("raahAccountType");
    },
  },
});

export const { setUser, setLoading, setError, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
