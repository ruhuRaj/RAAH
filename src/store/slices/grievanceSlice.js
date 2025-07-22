import { createSlice } from "@reduxjs/toolkit";
// import { setError, setLoading } from "./authSlice";
import { act } from "react";

const initialState = {
  latestGrievances: [],
  allGrievances: [],
  assignedGrievances: [],
  grievanceStats: { resolved: 0, pending: 0, rejected: 0, total: 0 },
  assignedStats: { total: 0 },
  loading: false,
  error: null,
};

const grievanceSlice = createSlice({
  name: 'grievance',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setLatestGrievances: (state, action) => {
      state.latestGrievances = action.payload;
    },
    setAllGrievances: (state, action) => {
      state.allGrievances = action.payload;
      const resolved = action.payload.filter(g => g.status === 'Resolved').length;
      const rejected = action.payload.filter(g => g.status === 'Rejected').length;
      const pending = action.payload.filter(g => !['Resolved', 'Rejected', 'Closed'].includes(g.status)).length;
      state.grievanceStats = {
        resolved,
        rejected,
        pending,
        total: action.payload.length,
      };
    },
    setAssignedGrievances: (state, action) => {
      state.assignedGrievances = action.payload;
      state.assignedStats.total = action.payload.length;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setLatestGrievances,
  setAllGrievances,
  setAssignedGrievances,
  setError
} = grievanceSlice.actions;

export default grievanceSlice.reducer;