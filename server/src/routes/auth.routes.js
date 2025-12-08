import express from "express";
import { registerUser, loginUser, checkUsername, checkEmail,} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/check-username", checkUsername);
router.post("/check-email", checkEmail);
router.get("/verify", verifyToken);

export default router;
