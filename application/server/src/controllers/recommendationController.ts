// controllers/recommendationController.ts
import { Request, Response } from 'express';
import {
  fetchGamesData as fetchGames,
  fetchUserData as fetchUser,
  generateGameEmbeddingsWithPCA as generateEmbeddings,
} from '../ml/embeddingService';

export const fetchGamesData = async (req: Request, res: Response) => {
  const games = await fetchGames();
  res.status(200).json(games);
};

export const fetchUserData = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const userData = await fetchUser(userId);
    if (!userData) {
      return res.status(404).json({ message: 'User data not found' });
    }
    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data', error });
  }
};

export const generateGameEmbeddingsWithPCA = async (
  req: Request,
  res: Response
) => {
  const embeddings = await generateEmbeddings();
  res.status(200).json(embeddings);
};
