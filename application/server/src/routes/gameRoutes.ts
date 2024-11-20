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

// These routes are for internal testing purposes only.
// Do not uncomment or expose them publicly, as these methods are intended for server-side use only.

// router.delete('/:gameId', removeGame);

router.get('/all', getAllGames);
router.post('/create', createGame);
router.get('/search', searchGames);
router.get('/:gameId', getGame);
router.put('/:gameId', editGame);

export default router;
