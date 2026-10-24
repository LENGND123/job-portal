import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { clearAuthCookie, setAuthCookie } from "../middleware/auth.js";
import { storedFilePath } from "../middleware/upload.js";

const ROLES = ["student", "recruiter"];

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function digits(value) {
  return String(value || "").replace(/\D/g, "");
}

export const register = asyncHandler(async (req, res) => {
  const fullname = String(req.body.fullname || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const phoneNumber = String(req.body.phoneNumber || "").trim();
  const password = String(req.body.password || "");
  const role = String(req.body.role || "");

  if (fullname.length < 2) {
    res.status(400).json({ success: false, message: "Enter your full name." });
    return;
  }
  if (!isEmail(email)) {
    res.status(400).json({ success: false, message: "Enter a valid email." });
    return;
  }
  if (digits(phoneNumber).length < 10) {
    res.status(400).json({ success: false, message: "Enter a valid phone number." });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    return;
  }
  if (!ROLES.includes(role)) {
    res.status(400).json({ success: false, message: "Choose Student or Recruiter." });
    return;
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ success: false, message: "An account with this email already exists." });
    return;
  }

  const user = await User.create({ fullname, email, phoneNumber, password, role });
  setAuthCookie(res, user._id);
  res.status(201).json({ success: true, message: "Account created.", user });
});

export const login = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const role = String(req.body.role || "");

  if (!isEmail(email) || !password || !ROLES.includes(role)) {
    res.status(400).json({ success: false, message: "Enter your email, password, and role." });
    return;
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ success: false, message: "Incorrect email or password." });
    return;
  }
  if (user.role !== role) {
    res.status(401).json({
      success: false,
      message: `This account is a ${user.role}. Choose ${user.role === "student" ? "Student" : "Recruiter"} and try again.`,
    });
    return;
  }

  setAuthCookie(res, user._id);
  res.json({ success: true, message: "Welcome back.", user });
});

export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: "Logged out." });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");
  const { fullname, email, phoneNumber, bio, skills } = req.body;

  if (fullname !== undefined) {
    const nextName = String(fullname).trim();
    if (nextName.length < 2) {
      res.status(400).json({ success: false, message: "Enter your full name." });
      return;
    }
    user.fullname = nextName;
  }

  if (email !== undefined) {
    const nextEmail = String(email).trim().toLowerCase();
    if (!isEmail(nextEmail)) {
      res.status(400).json({ success: false, message: "Enter a valid email." });
      return;
    }
    const taken = await User.findOne({ email: nextEmail, _id: { $ne: user._id } });
    if (taken) {
      res.status(409).json({ success: false, message: "An account with this email already exists." });
      return;
    }
    user.email = nextEmail;
  }

  if (phoneNumber !== undefined) {
    const nextPhone = String(phoneNumber).trim();
    if (digits(nextPhone).length < 10) {
      res.status(400).json({ success: false, message: "Enter a valid phone number." });
      return;
    }
    user.phoneNumber = nextPhone;
  }

  if (bio !== undefined) user.profile.bio = String(bio).trim();
  if (skills !== undefined) {
    user.profile.skills = String(skills)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  const photo = req.files?.profilePhoto?.[0];
  const resume = req.files?.resume?.[0];
  if (photo) user.profile.profilePhoto = storedFilePath(photo);
  if (resume) {
    user.profile.resume = storedFilePath(resume);
    user.profile.resumeOriginalName = resume.originalname;
  }

  await user.save();
  res.json({ success: true, message: "Profile updated.", user });
});
