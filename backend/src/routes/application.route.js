import { Router } from "express";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
} from "../controllers/application.controller.js";
import { isAuthenticated, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/get", isAuthenticated, requireRole("student"), getAppliedJobs);
router.get("/:id/applicants", isAuthenticated, requireRole("recruiter"), getApplicants);
router.post("/apply/:id", isAuthenticated, requireRole("student"), applyJob);
router.post("/status/:id/update", isAuthenticated, requireRole("recruiter"), updateStatus);

export default router;
