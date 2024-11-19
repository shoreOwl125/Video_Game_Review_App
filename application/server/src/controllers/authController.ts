import { Request, Response, NextFunction } from 'express';
import User from '../models/UserModel';
import { User as UserInterface } from '../interfaces/User';
import { UserData as UserDataInterface } from '../interfaces/UserData';
import UserData from '../models/UserDataModel';
import passport from 'passport';
import { generateToken, clearToken } from '../utils/auth';
import jwt from 'jsonwebtoken';

const userDataModel = new UserData();

const authStatus = async (req: Request, res: Response) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.json({ loggedIn: false, userId: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await User.findById((decoded as any).userId);

    if (user) {
      return res.json({ loggedIn: true, userId: user.id });
    } else {
      return res.json({ loggedIn: false, userId: null });
    }
  } catch (error) {
    return res.json({ loggedIn: false, userId: null });
  }
};

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, theme_preference } = req.body;

  try {
    // Check if email or username already exists
    const userExistsByEmail = await User.findByEmail(email);
    if (userExistsByEmail) {
      return res
        .status(400)
        .json({ message: 'A user with this email already exists' });
    }

    const userExistsByUsername = await User.findByUsername(name);
    if (userExistsByUsername) {
      return res
        .status(400)
        .json({ message: 'This username is already taken' });
    }

    // Create user_data entry
    const userData: Omit<
      UserDataInterface,
      'id' | 'created_at' | 'updated_at'
    > = {
      search_history: [],
      interests: [],
      view_history: [],
      review_history: [],
      genres: [],
    };

    const userDataId = await userDataModel.createUserData(userData);

    // Insert user entry
    const user: UserInterface = await User.create({
      name,
      email,
      password,
      theme_preference,
      user_data_id: userDataId,
    });

    // Generate token and respond
    const userIdStr = user.id.toString();
    generateToken(res, userIdStr);

    return res.status(201).json({
      id: userIdStr,
      name: user.name,
      email: user.email,
      theme_preference: user.theme_preference,
      user_data_id: user.user_data_id,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Error registering user', error });
  }
};

const authenticateUser = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  const user = email
    ? await User.findByEmail(email)
    : await User.findByUsername(name);

  console.log('USER: ' + user);
  if (user && (await User.comparePassword(user.password, password))) {
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
