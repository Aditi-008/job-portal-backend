// src/redux/applicationSlice.js

import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
  name: "application",
  initialState: {
    applicants: [], // ✅ Ensure it's an array to avoid .map() errors
    applications: [], // ✅ Optional: holds the jobs a user has applied to
  },
  reducers: {
    setAllApplicants: (state, action) => {
      state.applicants = action.payload;
    },
    setAllAppliedJobs: (state, action) => {
      state.applications = action.payload;
    },
    clearApplications: (state) => {
      state.applicants = [];
      state.applications = [];
    },
  },
});

export const {
  setAllApplicants,
  setAllAppliedJobs,
  clearApplications,
} = applicationSlice.actions;

export default applicationSlice.reducer;
