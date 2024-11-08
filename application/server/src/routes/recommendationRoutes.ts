import { Router } from 'express';
import {
  fetchGamesData,
  fetchUserData,
  generateGameEmbeddingsWithPCA,
} from '../controllers/recommendationController';

const router = Router();

router.get('/fetchGames', fetchGamesData);
router.get('/fetchUser/:id', fetchUserData);
router.get('/generateEmbeddingsWithPCA', generateGameEmbeddingsWithPCA);

export default router;
