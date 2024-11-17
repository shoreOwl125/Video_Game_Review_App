import { Request, Response } from 'express';
import { User as UserInterface } from '../interfaces/User';
import User from '../models/UserModel';

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInterface | undefined;

    if (!user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const fullUserData = await User.findById(user.id);

    if (!fullUserData) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Sends selected user info fetched from the database as a JSON response
    res.json({
      id: fullUserData.id,
      name: fullUserData.name,
      email: fullUserData.email,
      profile_pic: fullUserData.profile_pic,
      theme_preference: fullUserData.theme_preference,
      user_data_id: fullUserData.user_data_id,
      created_at: fullUserData.created_at,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: 'Missing email parameter' });
    }

    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserByUserName = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({ message: 'Missing username parameter' });
    }

    const user = await User.findByUsername(name);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user by username:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
