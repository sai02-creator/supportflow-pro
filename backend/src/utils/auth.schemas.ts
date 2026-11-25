
import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(80, "Name cannot exceed 80 characters"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Please provide a valid email address").max(254)),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .refine(
      (password) => Buffer.byteLength(password, "utf8") <= 72,
      "Password cannot exceed 72 bytes"
    ),
});

export type RegisterInput = z.infer<typeof registerSchema>;
