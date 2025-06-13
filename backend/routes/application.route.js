// ✅ Correct version of backend/routes/application.route.js

import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  applyJob,
  getAppliedJobs,
  updateStatus,
  getSingleJobWithApplicantsCount,
  getRecentApplicants,
  getApplicantsByJob, // ✅ Make sure this exists in your controller
} from "../controllers/application.controller.js";

const router = express.Router();

// ✅ Apply for a job
router.post("/apply/:jobId", isAuthenticated, applyJob);

// ✅ Get all jobs applied by the logged-in user
router.get("/get", isAuthenticated, getAppliedJobs);

// ✅ Get all applicants for a specific job
router.get("/:jobId/applicants", isAuthenticated, getApplicantsByJob); // ✅ use only this

// ✅ Update application status
router.post("/status/:applicationId/update", isAuthenticated, updateStatus);

// ✅ Get job details with total applicants & applied status
router.get("/:jobId/details", isAuthenticated, getSingleJobWithApplicantsCount);

// ✅ Get recent applicants (last 5) for a specific job
router.get("/recent/:jobId", isAuthenticated, getRecentApplicants);

export default router;
