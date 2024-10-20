import { Request, Response } from "express";
import User from "../models/User";
import { generateToken, clearToken } from "../utils/auth";

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  const userExists = await User.findByEmail(email);

  if (userExists) {
    return res.status(400).json({ message: "The user already exists" });
  }

  // Create a new user
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    // Ensure user.id is a string
    const userIdStr = user.id.toString();
    generateToken(res, userIdStr);
    return res.status(201).json({
      id: userIdStr,
      name: user.name,
      email: user.email,
    });
  } else {
    return res
      .status(400)
      .json({ message: "An error occurred in creating the user" });
  }
};

const authenticateUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findByEmail(email);

  if (user && (await User.comparePassword(user.password, password))) {
    // Ensure user.id is a string
    const userIdStr = user.id.toString();
    generateToken(res, userIdStr);
    return res.status(200).json({
      id: userIdStr,
      name: user.name,
      email: user.email,
    });
  } else {
    return res
      .status(401)
      .json({ message: "User not found / password incorrect" });
  }
};

const logoutUser = (req: Request, res: Response) => {
  clearToken(res);
  return res.status(200).json({ message: "User logged out" });
};

export { registerUser, authenticateUser, logoutUser };
