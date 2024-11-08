import jwt from 'jsonwebtoken';
import { Response } from 'express';

const generateToken = (res: Response, userId: string) => {
  const jwtSecret = process.env.JWT_SECRET || '';
  const token = jwt.sign({ userId }, jwtSecret, {
    expiresIn: '1h',
  });

  res.cookie('jwt', token, {
    httpOnly: false, // Temporarily set to false for debugging
    secure: false, // Set to false for localhost
    sameSite: 'lax', // Match the working test-cookie settings
    maxAge: 60 * 60 * 1000, // 1 hour
  });
};

const clearToken = (res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: false,
    expires: new Date(0),
  });
};
export { generateToken, clearToken };
