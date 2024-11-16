import express from 'express';
import { getUser, getUserByEmail } from '../controllers/userController';

const router = express.Router();

router.get('/:id', getUser);
router.get('/:email', getUserByEmail);

export default router;
