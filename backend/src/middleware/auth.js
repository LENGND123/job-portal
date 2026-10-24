import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

function secret() {
  return process.env.JWT_SECRET || "jobhunt-local-dev-secret";
}

function cookieBase() {
  const secure = Boolean(process.env.VERCEL) || process.env.NODE_ENV === "production";
  return { httpOnly: true, sameSite: "lax", secure, path: "/" };
}

export function setAuthCookie(res, userId) {
  const token = jwt.sign({ id: userId }, secret(), { expiresIn: "7d" });
  res.cookie("token", token, { ...cookieBase(), maxAge: 7 * 24 * 60 * 60 * 1000 });
}

export function clearAuthCookie(res) {
  res.cookie("token", "", { ...cookieBase(), expires: new Date(0) });
}

async function userFromRequest(req) {
  const token = req.cookies?.token;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, secret());
    return User.findById(decoded.id);
  } catch {
    return null;
  }
}

export async function isAuthenticated(req, res, next) {
  const user = await userFromRequest(req);
  if (!user) {
    res.status(401).json({ success: false, message: "Please login to continue." });
    return;
  }
  req.user = user;
  next();
}

export async function optionalAuth(req, res, next) {
  req.user = await userFromRequest(req);
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: "You do not have access to this page." });
      return;
    }
    next();
  };
}
