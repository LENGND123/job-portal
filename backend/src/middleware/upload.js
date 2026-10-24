import path from "node:path";
import multer from "multer";
import { uploadsDir } from "../paths.js";

const IMAGE_EXT = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
const RESUME_EXT = [".pdf", ".doc", ".docx"];
const onVercel = Boolean(process.env.VERCEL);

const storage = onVercel
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, uploadsDir),
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase().slice(0, 8);
        const allowed = [...IMAGE_EXT, ...RESUME_EXT];
        const safeExt = allowed.includes(ext) ? ext : "";
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
      },
    });

export function storedFilePath(file) {
  if (!file) return "";
  if (file.buffer) {
    const mime = file.mimetype || "application/octet-stream";
    return `data:${mime};base64,${file.buffer.toString("base64")}`;
  }
  return `/uploads/${file.filename}`;
}

function accept(file, allowedExt, message) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.mimetype === "image/svg+xml" || ext === ".svg") {
    return "Please upload a PNG, JPG, or WEBP image.";
  }
  if (!allowedExt.includes(ext)) return message;
  return "";
}

function wrap(uploader) {
  return (req, res, next) => {
    uploader(req, res, (err) => {
      if (!err) {
        next();
        return;
      }
      err.status = 400;
      next(err);
    });
  };
}

const upload = multer({
  storage,
  limits: { fileSize: onVercel ? 2.5 * 1024 * 1024 : 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.fieldname === "resume") {
      const message = accept(file, RESUME_EXT, "Resume must be a PDF or Word file.");
      cb(message ? new Error(message) : null, !message);
      return;
    }
    const message = accept(file, IMAGE_EXT, "Please upload a PNG, JPG, or WEBP image.");
    cb(message ? new Error(message) : null, !message);
  },
});

export const profileUpload = wrap(
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ])
);

export const logoUpload = wrap(upload.single("logo"));
