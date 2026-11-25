import { Router } from "express";
import {
  loginUser,
  registerUser,
} from "../controllers/auth.controller.js";

const router = Router();

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

export default router;