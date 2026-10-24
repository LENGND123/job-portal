import { Router } from "express";
import { login, logout, me, register, updateProfile } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.js";
import { profileUpload } from "../middleware/upload.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isAuthenticated, me);
router.post("/profile/update", isAuthenticated, profileUpload, updateProfile);

export default router;
