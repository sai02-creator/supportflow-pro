import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
  loginUser,
  registerUser,
} from "../controllers/auth.controller.js";

const router = Router();

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);
// GET /api/auth/me - Protected route
router.get("/me", authenticateToken, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Authentication successful",
    data: {
      user: req.user,
    },
  });
});

export default router;