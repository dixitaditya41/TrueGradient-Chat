import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { signup ,login ,googleAuth,getCurrentUser} from "../controllers/authController.js";


const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/google").post(googleAuth);
router.route("/me").get(authMiddleware, getCurrentUser);

export default router; 