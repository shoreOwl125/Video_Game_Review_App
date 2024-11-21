import express from 'express';
import {
  getUser,
  getUserByEmail,
  updateUserProfilePicture,
} from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';
import { fileUploadMiddleware } from '../middleware/fileUploadMiddleware';

const router = express.Router();

router.get('/:id', authenticate, getUser);
router.get('/email/:email', authenticate, getUserByEmail);
router.post(
  '/upload-profile-picture',
  authenticate,
  fileUploadMiddleware,
  updateUserProfilePicture
);

export default router;
