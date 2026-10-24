import { Company } from "../models/Company.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { escapeRegex } from "../utils/escapeRegex.js";
import { storedFilePath } from "../middleware/upload.js";

async function ownCompany(id, userId) {
  const company = await Company.findById(id);
  if (!company) return { error: { status: 404, message: "Company not found." } };
  if (String(company.userId) !== String(userId)) {
    return { error: { status: 403, message: "You can only open your own companies." } };
  }
  return { company };
}

export const registerCompany = asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  if (name.length < 2) {
    res.status(400).json({ success: false, message: "Enter a company name." });
    return;
  }
  const existing = await Company.findOne({ name: new RegExp(`^${escapeRegex(name)}$`, "i") });
  if (existing) {
    res.status(409).json({ success: false, message: "A company with this name already exists." });
    return;
  }
  const company = await Company.create({ name, userId: req.user._id });
  res.status(201).json({ success: true, message: "Company created.", company });
});

export const getCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, companies });
});

export const getCompanyById = asyncHandler(async (req, res) => {
  const { company, error } = await ownCompany(req.params.id, req.user._id);
  if (error) {
    res.status(error.status).json({ success: false, message: error.message });
    return;
  }
  res.json({ success: true, company });
});

export const updateCompany = asyncHandler(async (req, res) => {
  const { company, error } = await ownCompany(req.params.id, req.user._id);
  if (error) {
    res.status(error.status).json({ success: false, message: error.message });
    return;
  }

  const name = req.body.name !== undefined ? String(req.body.name).trim() : company.name;
  if (name.length < 2) {
    res.status(400).json({ success: false, message: "Enter a company name." });
    return;
  }
  const clash = await Company.findOne({
    _id: { $ne: company._id },
    name: new RegExp(`^${escapeRegex(name)}$`, "i"),
  });
  if (clash) {
    res.status(409).json({ success: false, message: "A company with this name already exists." });
    return;
  }

  company.name = name;
  if (req.body.description !== undefined) company.description = String(req.body.description).trim();
  if (req.body.website !== undefined) company.website = String(req.body.website).trim();
  if (req.body.location !== undefined) company.location = String(req.body.location).trim();
  if (req.file) company.logo = storedFilePath(req.file);

  await company.save();
  res.json({ success: true, message: "Company updated.", company });
});
