import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
  loading: false,
  signupData: null, // To temporarily store signup form data for OTP verification
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem("token", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("token");
      }
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    // Reducer to set signup data
    setSignupData(state, action) {
      state.signupData = action.payload;
    },
    // Clear signup data (optional, but good for cleanup)
    clearSignupData(state) {
      state.signupData = null;
    }
  },
});

export const { setToken, setLoading, setSignupData, clearSignupData } = authSlice.actions;
export default authSlice.reducer;
