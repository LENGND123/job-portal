import { Router } from "express";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
  updateJob,
} from "../controllers/job.controller.js";
import { isAuthenticated, optionalAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.post("/post", isAuthenticated, requireRole("recruiter"), postJob);
router.get("/get", getAllJobs);
router.get("/getadminjobs", isAuthenticated, requireRole("recruiter"), getAdminJobs);
router.get("/get/:id", optionalAuth, getJobById);
router.put("/update/:id", isAuthenticated, requireRole("recruiter"), updateJob);

export default router;
