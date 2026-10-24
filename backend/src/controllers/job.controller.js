import { Company } from "../models/Company.js";
import { Job } from "../models/Job.js";
import { Application } from "../models/Application.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { escapeRegex } from "../utils/escapeRegex.js";

const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract"];

function readJobBody(body) {
  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  const location = String(body.location || "").trim();
  const jobType = String(body.jobType || "").trim();
  const companyId = String(body.companyId || "").trim();
  const requirements = Array.isArray(body.requirements)
    ? body.requirements.map((item) => String(item).trim()).filter(Boolean)
    : String(body.requirements || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
  const salary = Number(body.salary);
  const experienceLevel = Number(body.experienceLevel);
  const position = Number(body.position);

  if (!title || !description || !location || !companyId) {
    return { error: "Fill in the title, description, location, and company." };
  }
  if (!JOB_TYPES.includes(jobType)) {
    return { error: "Choose a job type." };
  }
  if (!Number.isFinite(salary) || salary < 0) {
    return { error: "Salary must be a number in LPA." };
  }
  if (!Number.isFinite(experienceLevel) || experienceLevel < 0) {
    return { error: "Experience must be zero or more years." };
  }
  if (!Number.isInteger(position) || position < 1) {
    return { error: "Enter at least one open position." };
  }
  if (requirements.length === 0) {
    return { error: "Add at least one requirement." };
  }

  return {
    value: { title, description, location, jobType, companyId, requirements, salary, experienceLevel, position },
  };
}

async function ownCompany(companyId, userId) {
  const company = await Company.findById(companyId);
  if (!company) return { error: { status: 404, message: "Company not found." } };
  if (String(company.userId) !== String(userId)) {
    return { error: { status: 403, message: "You can only post jobs for your own companies." } };
  }
  return { company };
}

export const postJob = asyncHandler(async (req, res) => {
  const parsed = readJobBody(req.body);
  if (parsed.error) {
    res.status(400).json({ success: false, message: parsed.error });
    return;
  }
  const { company, error } = await ownCompany(parsed.value.companyId, req.user._id);
  if (error) {
    res.status(error.status).json({ success: false, message: error.message });
    return;
  }
  const { companyId: _companyId, ...fields } = parsed.value;
  const job = await Job.create({
    ...fields,
    company: company._id,
    created_by: req.user._id,
  });
  const populated = await job.populate("company");
  res.status(201).json({ success: true, message: "Job posted.", job: populated });
});

export const getAllJobs = asyncHandler(async (req, res) => {
  const keyword = String(req.query.keyword || "").trim().slice(0, 80);
  const query = {};
  if (keyword) {
    const safe = escapeRegex(keyword);
    const companies = await Company.find({ name: { $regex: safe, $options: "i" } }).select("_id");
    query.$or = [
      { title: { $regex: safe, $options: "i" } },
      { description: { $regex: safe, $options: "i" } },
      { location: { $regex: safe, $options: "i" } },
      { requirements: { $regex: safe, $options: "i" } },
      { company: { $in: companies.map((item) => item._id) } },
    ];
  }
  const jobs = await Job.find(query).populate("company").sort({ createdAt: -1 });
  res.json({ success: true, jobs });
});

export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate("company");
  if (!job) {
    res.status(404).json({ success: false, message: "Job not found." });
    return;
  }
  const isApplied = req.user
    ? Boolean(await Application.exists({ job: job._id, applicant: req.user._id }))
    : false;
  res.json({
    success: true,
    job,
    isApplied,
    applicationCount: job.applications.length,
  });
});

export const getAdminJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ created_by: req.user._id }).populate("company").sort({ createdAt: -1 });
  res.json({ success: true, jobs });
});

export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404).json({ success: false, message: "Job not found." });
    return;
  }
  if (String(job.created_by) !== String(req.user._id)) {
    res.status(403).json({ success: false, message: "You can only edit your own jobs." });
    return;
  }
  const parsed = readJobBody(req.body);
  if (parsed.error) {
    res.status(400).json({ success: false, message: parsed.error });
    return;
  }
  const { company, error } = await ownCompany(parsed.value.companyId, req.user._id);
  if (error) {
    res.status(error.status).json({ success: false, message: error.message });
    return;
  }
  const { companyId: _ignoredCompany, ...fields } = parsed.value;
  Object.assign(job, fields, { company: company._id });
  await job.save();
  const populated = await job.populate("company");
  res.json({ success: true, message: "Job updated.", job: populated });
});
