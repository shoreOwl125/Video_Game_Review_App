import { Request, Response } from 'express';
import UserDataModel from '../models/UserDataModel';
import { UserData as UserDataInterface } from '../interfaces/UserData';
import { getGameRecommendations } from '../services/recommendationService';

const userDataModel = new UserDataModel();

export const createUserData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userData: Omit<
      UserDataInterface,
      'id' | 'created_at' | 'updated_at'
    > = req.body;
    const userDataId = await userDataModel.createUserData(userData);
    res
      .status(201)
      .json({ message: 'User data created successfully', userDataId });
  } catch (error) {
    console.error('Error creating user data:', error);
    res.status(500).json({ message: 'Error creating user data', error });
  }
};

export const getUserDataById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userData = await userDataModel.getUserDataById(Number(id));

    if (!userData) {
      res.status(404).json({ message: 'User data not found' });
    } else {
      res.status(200).json(userData);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data', error });
  }
};

export const updateUserData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: Partial<UserDataInterface> = req.body;
    await userDataModel.updateUserData(Number(id), updates);
    res.status(200).json({ message: 'User data updated successfully' });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ message: 'Error updating user data', error });
  }
};

export const deleteUserData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    await userDataModel.deleteUserData(Number(id));
    res.status(200).json({ message: 'User data deleted successfully' });
  } catch (error) {
    console.error('Error deleting user data:', error);
    res.status(500).json({ message: 'Error deleting user data', error });
  }
};

export const getRecommendations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const recommendations = await getGameRecommendations(Number(id));
    res.status(200).json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: 'Error fetching recommendations', error });
  }
};
