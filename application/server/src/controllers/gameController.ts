// gameController.ts

import { Request, Response } from 'express';
import Game from '../models/GameModel';
import { Game as GameInterface } from '../interfaces/Game';

// Instantiate Game class
const gameModel = new Game();

export const populateGames = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const games = await gameModel.getTopRatedGames(30);
    if (games.length === 0) {
      res.status(404).json({ message: 'No games found' });
      return;
    }
    res.status(200).json(games);
  } catch (error) {
    console.error('Error in populateGames controller:', error);
    res.status(500).json({ message: 'Error fetching games', error });
  }
};

export const createGame = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const game: Omit<GameInterface, 'game_id' | 'created_at' | 'updated_at'> = {
      ...req.body,
      tags: req.body.tags || [],
      platforms: req.body.platforms || [],
    };
    await gameModel.addGame(game);
    res.status(201).json({ message: 'Game created successfully' });
  } catch (error) {
    console.error('Error in createGame controller:', error);
    res.status(500).json({ message: 'Error creating game', error });
  }
};

export const searchGames = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { query, genre, review_rating, game_mode } = req.query;
    const games = await gameModel.findGames(
      query as string,
      genre as string,
      Number(review_rating),
      game_mode as 'single-player' | 'multiplayer' | 'both'
    );

    if (!games.length) {
      res.status(404).json({ message: 'No games found' });
    } else {
      res.status(200).json(games);
    }
  } catch (error) {
    console.error('Error in searchGames controller:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const removeGame = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { gameId } = req.params;
    await gameModel.deleteGame(Number(gameId));
    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Error in removeGame controller:', error);
    res.status(500).json({ message: 'Error deleting game', error });
  }
};

export const editGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameId } = req.params;
    const updates: Partial<GameInterface> = {
      ...req.body,
      tags: req.body.tags || [],
      platforms: req.body.platforms || [],
    };
    await gameModel.updateGame(Number(gameId), updates);
    res.status(200).json({ message: 'Game updated successfully' });
  } catch (error) {
    console.error('Error in editGame controller:', error);
    res.status(500).json({ message: 'Error updating game', error });
  }
};

export const getGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameId } = req.params;
    const game = await gameModel.getGameById(Number(gameId));

    if (!game) {
      res.status(404).json({ message: 'Game not found' });
    } else {
      res.status(200).json(game);
    }
  } catch (error) {
    console.error('Error in getGame controller:', error);
    res.status(500).json({ message: 'Error fetching game', error });
  }
};

export const getAllGames = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let limit = parseInt(req.query.limit as string, 10) || 50;

    if (isNaN(limit) || limit <= 0) {
      limit = 50; // Default to 50 if invalid
    }

    const games = await gameModel.getAllGames(limit);

    if (games.length === 0) {
      res.status(404).json({ message: 'No games found' });
      return;
    }

    res.status(200).json(games);
  } catch (error) {
    console.error('Error in getAllGames controller:', error);
    res.status(500).json({ message: 'Error fetching games', error });
  }
};
