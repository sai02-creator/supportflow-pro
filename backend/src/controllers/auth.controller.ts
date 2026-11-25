
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { prisma } from "../lib/prisma.js";
import { registerSchema } from "../utils/auth.schemas.js";

export const registerUser = async (req: Request, res: Response) => {
  try {
    // 1. Validate registration data
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { name, email, password } = validation.data;

    // 2. Check whether the email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create the user in PostgreSQL
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // 5. Return safe user information
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: { user },
    });
  } catch (error) {
    // Handle duplicate email conflicts
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating your account",
    });
  }
};
