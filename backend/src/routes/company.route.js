import { Router } from "express";
import {
  getCompanies,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../controllers/company.controller.js";
import { isAuthenticated, requireRole } from "../middleware/auth.js";
import { logoUpload } from "../middleware/upload.js";

const router = Router();

router.use(isAuthenticated, requireRole("recruiter"));
router.post("/register", registerCompany);
router.get("/get", getCompanies);
router.get("/get/:id", getCompanyById);
router.put("/update/:id", logoUpload, updateCompany);

export default router;
