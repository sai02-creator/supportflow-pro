
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import {
  createTicketSchema,
  updateTicketSchema,
} from "../utils/ticket.schemas.js";

// Create a new ticket
export const createTicket = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required",
      });
    }

    const validation = createTicketSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const ticket = await prisma.ticket.create({
      data: {
        ...validation.data,
        customerName: user.name,
        customerEmail: user.email,
        createdById: userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: { ticket },
    });
  } catch (error) {
    console.error("Create ticket error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the ticket",
    });
  }
};

// Get all tickets belonging to the authenticated customer
export const getMyTickets = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required",
      });
    }

    const tickets = await prisma.ticket.findMany({
      where: {
        createdById: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Tickets retrieved successfully",
      count: tickets.length,
      data: { tickets },
    });
  } catch (error) {
    console.error("Get my tickets error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while retrieving tickets",
    });
  }
};

// Get a specific ticket belonging to the authenticated customer
export const getTicketById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required",
      });
    }

    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Ticket ID is required",
      });
    }

    const ticket = await prisma.ticket.findFirst({
      where: {
        id,
        createdById: userId,
      },
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ticket retrieved successfully",
      data: { ticket },
    });
  } catch (error) {
    console.error("Get ticket by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while retrieving the ticket",
    });
  }
};

// Update ticket status and/or priority
export const updateTicket = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Ticket ID is required",
      });
    }

    const validation = updateTicketSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const existingTicket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!existingTicket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: validation.data,
    });

    return res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      data: { ticket: updatedTicket },
    });
  } catch (error) {
    console.error("Update ticket error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the ticket",
    });
  }
};
