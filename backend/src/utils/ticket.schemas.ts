
import { z } from "zod";

// Validation for creating a ticket
export const createTicketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Ticket title must contain at least 5 characters")
    .max(150, "Ticket title cannot exceed 150 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must contain at least 10 characters")
    .max(5000, "Description cannot exceed 5000 characters"),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "URGENT"])
    .default("MEDIUM"),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

// Validation for updating ticket status and priority
export const updateTicketSchema = z
  .object({
    status: z
      .enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"])
      .optional(),

    priority: z
      .enum(["LOW", "MEDIUM", "HIGH", "URGENT"])
      .optional(),
  })
  .refine(
    (data) => data.status !== undefined || data.priority !== undefined,
    {
      message: "At least one field (status or priority) must be provided",
    }
  );

export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
