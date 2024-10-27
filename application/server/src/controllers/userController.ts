import { Request, Response } from "express";
import { User as UserInterface } from "../interfaces/User"; // Import the User interface

export const getUser = (req: Request, res: Response) => {
  const user = req.user as UserInterface | undefined;

  if (!user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json({ userId: user.id });
};
