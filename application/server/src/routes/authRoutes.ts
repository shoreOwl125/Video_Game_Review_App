import express from 'express';
import passport from 'passport';
import {
  registerUser,
  authenticateUser,
  logoutUser,
  googleCallback,
  authStatus,
} from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authenticateUser);
router.post('/logout', logoutUser);
router.get('/status', authStatus);
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/google/callback', googleCallback);

export default router;
