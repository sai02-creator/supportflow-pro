
import { Router } from "express";
import { UserRole } from "../generated/prisma/client.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";

const router = Router();

// ADMIN-only route
router.get(
  "/admin",
  authenticateToken,
  authorizeRoles(UserRole.ADMIN),
  (_req, res) => {
    return res.status(200).json({
      success: true,
      message: "Welcome to the admin dashboard",
      role: UserRole.ADMIN,
    });
  }
);

// AGENT-only route
router.get(
  "/agent",
  authenticateToken,
  authorizeRoles(UserRole.AGENT),
  (_req, res) => {
    return res.status(200).json({
      success: true,
      message: "Welcome to the agent dashboard",
      role: UserRole.AGENT,
    });
  }
);

// CUSTOMER-only route
router.get(
  "/customer",
  authenticateToken,
  authorizeRoles(UserRole.CUSTOMER),
  (_req, res) => {
    return res.status(200).json({
      success: true,
      message: "Welcome to the customer dashboard",
      role: UserRole.CUSTOMER,
    });
  }
);

export default router;
