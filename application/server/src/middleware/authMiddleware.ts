import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";
import asyncHandler from "express-async-handler";
import { AuthenticationError } from "./errorMiddleware";

// Declare UserBasicInfo interface
interface UserBasicInfo {
  id: number;
  name: string;
  email: string;
}

// Extend the Express Request interface in this file
declare global {
  namespace Express {
    interface Request {
      user?: UserBasicInfo;
    }
  }
}

const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.jwt;

      if (!token) {
        throw new AuthenticationError("Token not found");
      }

      const jwtSecret = process.env.JWT_SECRET || "";
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      if (!decoded || !decoded.userId) {
        throw new AuthenticationError("UserId not found");
      }

      // Fetch the user by ID from MySQL
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw new AuthenticationError("User not found");
      }

      // Assign the user to req.user
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      next();
    } catch (e) {
      throw new AuthenticationError("Invalid token");
    }
  }
);

export { authenticate };
