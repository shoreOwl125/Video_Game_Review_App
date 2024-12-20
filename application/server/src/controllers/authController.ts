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
  const { name, email, password, profile_pic, theme_preference } = req.body;

  // Use provided profile picture or default to the predefined path
  const profilePic =
    profile_pic || 'application/web/public/Default-Profile-Picture.jpg';

  try {
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
    const user: UserInterface = await User.create({
      name,
      email,
      password,
      profile_pic: profilePic, // Assign the processed profile picture
      theme_preference,
      user_data_id: userDataId,
    });

    const userIdStr = user.id.toString();
    generateToken(res, userIdStr);

    return res.status(201).json({
      id: userIdStr,
      name: user.name,
      email: user.email,
      profile_pic: user.profile_pic, // Include profile_pic in the response
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

const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'google',
    { session: false },
    async (err: Error | null, profile: any) => {
      if (err || !profile) {
        console.error('Google authentication error:', err);
        return res
          .status(400)
          .json({ message: 'Google authentication failed' });
      }

      try {
        console.log('Authenticated user profile:', profile);

        let user = await User.findByEmail(profile.emails[0].value);

        if (!user) {
          const userData = {
            search_history: [],
            interests: [],
            view_history: [],
            review_history: [],
            genres: [],
          };

          const userDataId = await userDataModel.createUserData(userData);

          // Create a default password (e.g., a random string)
          const defaultPassword = Math.random()
            .toString(36)
            .substring(2, 12);

          // Create the user
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: defaultPassword,
            profile_pic: profile.photos[0]?.value || 'default-profile-pic.jpg',
            theme_preference: 'light',
            user_data_id: userDataId,
          });
        }

        // Generate token and set cookie
        generateToken(res, user.id.toString());

        // Redirect to the home page
        return res.redirect('/index.html');
      } catch (error) {
        console.error('Error handling Google user login:', error);
        return res
          .status(500)
          .json({ message: 'Internal server error during Google login' });
      }
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
