import { Request, Response } from "express";
import { IUser } from "../models/User"; // Import IUser for assertions if needed

const getUser = (req: Request, res: Response) => {
  const userId = (req.user as IUser).id; // Assert req.user as IUser if necessary
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Fetch and respond with user profile using userId
  res.json({ userId });
};

export { getUser };
