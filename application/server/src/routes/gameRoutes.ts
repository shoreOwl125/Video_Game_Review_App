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

router.post('/create', createGame);
router.get('/search', searchGames);
router.delete('/:gameId', removeGame);
router.put('/:gameId', editGame);
router.get('/:gameId', getGame);
router.get('/all', getAllGames);

export default router;
