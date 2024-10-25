import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User";
import passport from "passport";
import { generateToken, clearToken } from "../utils/auth";

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  const userExists = await User.findByEmail(email);

  if (userExists) {
    return res.status(400).json({ message: "The user already exists" });
  }

  // Create a new user
  const user: IUser = await User.create({
    name,
    email,
    password,
  });

  // Generate token using user id as string
  const userIdStr = user.id.toString();
  generateToken(res, userIdStr);
  return res.status(201).json({
    id: userIdStr,
    name: user.name,
    email: user.email,
  });
};

const authenticateUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findByEmail(email);

  if (user && (await User.comparePassword(user.password, password))) {
    // Generate token using user id as string
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

// Google login initiation (redirects to Google)
export const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Google login callback
export const googleCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "google",
    { session: false },
    (err: Error | null, user: IUser | false) => {
      if (err || !user) {
        console.log("Authentication error or no user:", err); // Debug
        return res
          .status(400)
          .json({ message: "Google authentication failed" });
      }

      console.log("Authenticated user:", user); // Check if user is populated

      const token = generateToken(res, user.id.toString());
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      // Send user details in response
      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    }
  )(req, res, next);
};

export { registerUser, authenticateUser, logoutUser };
