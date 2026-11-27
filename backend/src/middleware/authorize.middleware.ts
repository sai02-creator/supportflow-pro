
import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "../generated/prisma/client.js";

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 1. Check whether the user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // 2. Check whether the user's role is allowed
    if (!allowedRoles.includes(req.user.role as UserRole)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
      });
    }

    // 3. Allow the request to continue
    next();
  };
};
