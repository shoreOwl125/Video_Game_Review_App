import { Router } from 'express';
import {
  createUserData,
  getUserDataById,
  updateUserData,
  deleteUserData,
  getRecommendations,
} from '../controllers/userDataController';

const router = Router();

// These routes are for internal testing purposes only.
// Do not uncomment or expose them publicly, as these methods are intended for server-side use only.

// router.post('/', createUserData);
// router.delete("/:id", deleteUserData);

router.get('/:id', getUserDataById);
router.put('/:id', updateUserData);
router.get('/:id/recommendations', getRecommendations);

export default router;
