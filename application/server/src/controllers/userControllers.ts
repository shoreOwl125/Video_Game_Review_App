import { Request, Response } from "express";
import { User as UserInterface } from "../interfaces/User"; // Import the User interface

const getUser = (req: Request, res: Response) => {
  // Cast req.user as UserInterface directly within the function
  const user = req.user as UserInterface | undefined;

  if (!user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Fetch and respond with user profile using userId
  res.json({ userId: user.id });
};

export { getUser };
