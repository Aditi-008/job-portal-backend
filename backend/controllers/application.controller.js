import mongoose from "mongoose";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

// ✅ Apply for a job
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

    const alreadyApplied = await Application.findOne({ applicant: userId, job: jobId });
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: "Already applied to this job" });
    }

    const newApplication = await Application.create({
      job: new mongoose.Types.ObjectId(jobId),
      applicant: new mongoose.Types.ObjectId(userId),
    });

    job.applications.push(newApplication._id);
    await job.save();

    res.status(201).json({ success: true, message: "Applied successfully", application: newApplication });
  } catch (error) {
    console.error("❌ Error in applyJob:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get all applicants for a specific job (Recruiter-only)
export const getApplicantsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).populate({
    path: "applications",
    populate: {
    path: "applicant",
    select: "fullname email phoneNumber profile",
  },
});


    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // ✅ Optional: check recruiter owns this job
    if (job.created_by.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    res.status(200).json({ success: true, applicants: job.applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Add this function in application.controller.js
export const getRecentApplicants = async (req, res) => {
  try {
    return res.status(200).json({ success: true, applicants: [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get all jobs the user has applied to
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const applications = await Application.find({ applicant: userId }).populate("job");

    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error("❌ Error in getAppliedJobs:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Update application status
// ✅ Update application status (with validation and error logging)


export const updateStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    console.log("🔥 Application ID:", applicationId);
    console.log("📥 New Status:", status);

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({ success: true, application });
  } catch (error) {
    console.error("❌ Error in updateStatus:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



// ✅ Get job + applicants count + user's application status
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
    const hasApplied = await Application.exists({ job: jobId, applicant: req.id });

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
