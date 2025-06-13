import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
  getSingleJobWithApplicantsCount,
  getRecentApplicants, // ✅ Added
} from "../controllers/application.controller.js";

const router = express.Router();

// ✅ Apply for a job
router.post("/apply/:jobId", isAuthenticated, applyJob);

// ✅ Get all jobs applied by the logged-in user
router.get("/get", isAuthenticated, getAppliedJobs);

// ✅ Get all applicants for a specific job
router.get("/:jobId/applicants", isAuthenticated, getApplicants);

// ✅ Update application status
router.post("/status/:applicationId/update", isAuthenticated, updateStatus);

// ✅ Get job details with total applicants & applied status
router.get("/:jobId/details", isAuthenticated, getSingleJobWithApplicantsCount);

// ✅ Get recent applicants (last 5) for a specific job
router.get("/recent/:jobId", isAuthenticated, getRecentApplicants);

export default router;
