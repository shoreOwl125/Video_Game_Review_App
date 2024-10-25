import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User"; // Ensure IUser is imported

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user as IUser; // Explicitly type req.user as IUser
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export { authenticate };
