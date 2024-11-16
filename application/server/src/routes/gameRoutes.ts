// gameRoutes.ts

import { Router } from 'express';
import {
  createGame,
  searchGames,
  removeGame,
  editGame,
  getGame,
  getAllGames,
} from '../controllers/gameController';

const router = Router();

router.get('/all', getAllGames);
router.post('/create', createGame);
router.get('/search', searchGames);
router.get('/:gameId', getGame);
router.put('/:gameId', editGame);
router.delete('/:gameId', removeGame);

export default router;
