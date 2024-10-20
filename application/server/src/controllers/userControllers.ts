import { Request, Response } from "express";
import User from "../models/User";

// Pure function for getting user
const getUser = async (req: Request, res: Response) => {
  try {
    // Use 'id' instead of '_id' as MySQL uses 'id'
    const userId = req.user?.id;

    // Ensure the userId exists before making the query
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch user by ID using only one argument
    const user = await User.findById(userId);

    // Handle if user is not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with immutable user data
    const userResponse = Object.freeze({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return res.status(200).json(userResponse);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export { getUser };
