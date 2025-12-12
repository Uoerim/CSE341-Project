import express from "express";
import {
  registerUser,
  loginUser,
  checkUsername,
  checkEmail,
  verifyToken,
  googleAuth,
  completeGoogleRegistration,
  phoneAuth,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/check-username", checkUsername);
router.post("/check-email", checkEmail);
router.get("/verify", verifyToken);
router.post("/google-auth", googleAuth);
router.post("/google-register", completeGoogleRegistration);
router.post("/phone-auth", phoneAuth);

export default router;
