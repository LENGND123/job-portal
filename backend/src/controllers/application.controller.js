import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const STATUSES = ["pending", "accepted", "rejected"];

export const applyJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404).json({ success: false, message: "Job not found." });
    return;
  }
  if (!req.user.profile?.resume) {
    res.status(400).json({
      success: false,
      message: "Upload a resume on your profile before applying.",
    });
    return;
  }
  const existing = await Application.findOne({ job: job._id, applicant: req.user._id });
  if (existing) {
    res.status(400).json({ success: false, message: "You have already applied for this job." });
    return;
  }
  const application = await Application.create({ job: job._id, applicant: req.user._id });
  job.applications.push(application._id);
  await job.save();
  res.status(201).json({ success: true, message: "Application sent.", application });
});

export const getAppliedJobs = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id })
    .populate({ path: "job", populate: { path: "company" } })
    .sort({ createdAt: -1 });
  res.json({ success: true, applications });
});

export const getApplicants = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate({
    path: "applications",
    populate: { path: "applicant", select: "fullname email phoneNumber profile" },
  });
  if (!job) {
    res.status(404).json({ success: false, message: "Job not found." });
    return;
  }
  if (String(job.created_by) !== String(req.user._id)) {
    res.status(403).json({ success: false, message: "You can only view applicants for your own jobs." });
    return;
  }
  const applications = [...job.applications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.json({
    success: true,
    job: { _id: job._id, title: job.title },
    applications,
  });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const status = String(req.body.status || "");
  if (!STATUSES.includes(status)) {
    res.status(400).json({ success: false, message: "Choose pending, accepted, or rejected." });
    return;
  }
  const application = await Application.findById(req.params.id).populate("job");
  if (!application) {
    res.status(404).json({ success: false, message: "Application not found." });
    return;
  }
  if (String(application.job.created_by) !== String(req.user._id)) {
    res.status(403).json({ success: false, message: "You can only update applicants for your own jobs." });
    return;
  }
  application.status = status;
  await application.save();
  res.json({ success: true, message: "Status updated.", application });
});
