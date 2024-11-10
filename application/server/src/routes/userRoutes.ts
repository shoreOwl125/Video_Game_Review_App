import express from 'express';
import { getUser, getUserByEmail } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/:id', authenticate, getUser);
router.get('/email/:email', authenticate, getUserByEmail);

export default router;
