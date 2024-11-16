import { Request, Response, NextFunction } from 'express';
import User from '../models/UserModel';
import { User as UserInterface } from '../interfaces/User';
import passport from 'passport';
import { generateToken, clearToken } from '../utils/auth';
import jwt from 'jsonwebtoken';

const authStatus = async (req: Request, res: Response) => {
  console.log('All Cookies:', req.cookies);

  const token = req.cookies.jwt;
  console.log('JWT Cookie from request:', token);

  if (!token) {
    console.log('No JWT cookie received');
    return res.json({ loggedIn: false, userId: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    console.log('Decoded JWT:', decoded);

    const user = await User.findById((decoded as any).userId);
    if (user) {
      console.log('User found:', user);
      return res.json({ loggedIn: true, userId: user.id });
    } else {
      console.log('User not found');
      return res.json({ loggedIn: false, userId: null });
    }
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.json({ loggedIn: false, userId: null });
  }
};

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, theme_preference, user_data_id } = req.body;

  // Check if the user already exists
  const userExists = await User.findByEmail(email);
  if (userExists) {
    return res.status(400).json({ message: 'The user already exists' });
  }

  // Create a new user
  const user: UserInterface = await User.create({
    name,
    email,
    password,
    theme_preference,
    user_data_id,
  });

  // Generate token using user id as string
  const userIdStr = user.id.toString();
  generateToken(res, userIdStr);

  return res.status(201).json({
    id: userIdStr,
    name: user.name,
    email: user.email,
    theme_preference: user.theme_preference,
    user_data_id: user.user_data_id,
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
      .json({ message: 'User not found / password incorrect' });
  }
};

const logoutUser = (req: Request, res: Response) => {
  clearToken(res);
  return res.status(200).json({ message: 'User logged out' });
};

// Google login initiation (redirects to Google)
const googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

// Google login callback
const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'google',
    { session: false },
    (err: Error | null, user: UserInterface | null) => {
      if (err || !user) {
        console.log('Authentication error or no user:', err);
        return res
          .status(400)
          .json({ message: 'Google authentication failed' });
      }

      console.log('Authenticated user:', user);

      const token = generateToken(res, user.id.toString());
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
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

export {
  registerUser,
  authenticateUser,
  logoutUser,
  googleCallback,
  googleLogin,
  authStatus,
};
