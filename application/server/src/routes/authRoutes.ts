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
// Check authentication status
router.get('/status', authStatus);
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/google/callback', googleCallback);

router.get('/test-cookie', (req, res) => {
  res.cookie('testCookie', 'testValue', {
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000,
  });
  res.send('Test cookie set');
});

export default router;
