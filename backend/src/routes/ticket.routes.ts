
import { Router } from "express";
import {
  createTicket,
  getMyTickets,
  getTicketById,
  updateTicket,
} from "../controllers/ticket.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import { UserRole } from "../generated/prisma/client.js";

const router = Router();

// Create a new ticket - CUSTOMER only
router.post(
  "/",
  authenticateToken,
  authorizeRoles(UserRole.CUSTOMER),
  createTicket
);

// Get all tickets belonging to the authenticated customer
router.get(
  "/",
  authenticateToken,
  authorizeRoles(UserRole.CUSTOMER),
  getMyTickets
);

// Get a specific ticket belonging to the authenticated customer
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles(UserRole.CUSTOMER),
  getTicketById
);

// Update ticket status or priority - ADMIN and AGENT only
router.patch(
  "/:id",
  authenticateToken,
  authorizeRoles(UserRole.ADMIN, UserRole.AGENT),
  updateTicket
);

export default router;
