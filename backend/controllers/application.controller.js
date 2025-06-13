import mongoose from "mongoose";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

// ✅ 1. Apply for a job
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.jobId;

    if (!userId || !jobId) {
      return res.status(400).json({ success: false, message: "Missing job ID or user ID" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const alreadyApplied = await Application.findOne({
      applicant: userId,
      job: jobId,
    });
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: "Already applied to this job" });
    }

    // ✅ Create new application
    const newApplication = await Application.create({
      job: new mongoose.Types.ObjectId(jobId),
      applicant: new mongoose.Types.ObjectId(userId),
    });

    // ✅ Push application into Job's applications array
    job.applications.push(newApplication._id);
    await job.save();

    res.status(201).json({
      success: true,
      message: "Applied successfully",
      application: newApplication,
    });
  } catch (error) {
    console.error("❌ Error in applyJob:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ 2. Get all applicants for a specific job (Admin/Company only)
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const applications = await Application.find({ job: jobId })
      .populate("applicant")
      .sort({ createdAt: -1 });

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({
      success: true,
      job: {
        ...job.toObject(),
        applications,
      },
    });
  } catch (error) {
    console.error("❌ Error in getApplicants:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ 3. Get all jobs the user has applied to
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const applications = await Application.find({ applicant: userId }).populate("job");

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("❌ Error in getAppliedJobs:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ 4. Update application status (e.g., approved/rejected)
export const updateStatus = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    const { status } = req.body;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: "Status updated",
      application,
    });
  } catch (error) {
    console.error("❌ Error in updateStatus:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ 5. Get single job with total applicants
export const getSingleJobWithApplicantsCount = async (req, res) => {
  try {
    const jobIdParam = req.params.jobId;

    if (!mongoose.Types.ObjectId.isValid(jobIdParam)) {
      return res.status(400).json({ success: false, message: "Invalid Job ID" });
    }

    const jobId = new mongoose.Types.ObjectId(jobIdParam);

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const totalApplicants = await Application.countDocuments({ job: jobId });

    const hasApplied = await Application.exists({
      job: jobId,
      applicant: req.id,
    });

    return res.status(200).json({
      success: true,
      job,
      totalApplicants,
      hasApplied: Boolean(hasApplied),
    });
  } catch (error) {
    console.error("❌ Error in getSingleJobWithApplicantsCount:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
