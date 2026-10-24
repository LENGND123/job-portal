import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "node:path";
import { backendRoot, uploadsDir } from "./paths.js";
import { connectDb } from "./config/db.js";
import { seedIfEmpty } from "./utils/seed.js";
import { errorHandler } from "./middleware/error.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config({ path: path.join(backendRoot, ".env") });

const app = express();
app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.CLIENT_ORIGIN || "http://localhost:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

function originAllowed(origin) {
  if (!origin || allowedOrigins.includes(origin)) return true;
  try {
    return new URL(origin).hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});
app.use(
  cors({
    origin(origin, callback) {
      callback(null, originAllowed(origin));
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use("/uploads", express.static(uploadsDir));

app.get("/", (_req, res) => {
  res.json({ success: true, message: "JobPortal API is running." });
});
app.get("/api/v1/health", (_req, res) => {
  res.json({ success: true });
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use(errorHandler);

let readyPromise;

export function ready() {
  if (!readyPromise) {
    readyPromise = connectDb()
      .then(() => seedIfEmpty())
      .catch((error) => {
        readyPromise = null;
        throw error;
      });
  }
  return readyPromise;
}

export { app };
