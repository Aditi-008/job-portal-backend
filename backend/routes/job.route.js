import express from "express";
// ✅ Correct
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

import {
  postJob,
  getAllJobs,
  getJobById,
  getAdminJobs
} from "../controllers/job.controller.js";

const router = express.Router();

// ✅ Route: POST a new job (admin only)
router.post("/post", isAuthenticated, postJob);

// ✅ Route: GET all jobs (searchable, public)
router.get("/get", getAllJobs);

// ✅ Route: GET single job by ID (for job details page)
router.get("/get/:id", getJobById);

// ✅ Route: GET all jobs created by admin
router.get("/getadminjobs", isAuthenticated, getAdminJobs);

export default router;
