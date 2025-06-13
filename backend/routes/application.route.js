import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
  getSingleJobWithApplicantsCount, // ✅ Route for job + applicants count
} from "../controllers/application.controller.js";

const router = express.Router();

// ✅ Apply for a job
router.post("/apply/:jobId", isAuthenticated, applyJob);

// ✅ Get all jobs applied by the logged-in user
router.get("/get", isAuthenticated, getAppliedJobs);

// ✅ Get all applicants for a specific job (admin/recruiter)
router.get("/:jobId/applicants", isAuthenticated, getApplicants);

// ✅ Update application status
router.post("/status/:applicationId/update", isAuthenticated, updateStatus);

// ✅ Get job details with total applicants
router.get("/:jobId/details", isAuthenticated, getSingleJobWithApplicantsCount);

export default router;
