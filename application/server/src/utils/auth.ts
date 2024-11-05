import jwt from 'jsonwebtoken';
import { Response } from 'express';

const generateToken = (res: Response, userId: string) => {
  const jwtSecret = process.env.JWT_SECRET || '';
  const token = jwt.sign({ userId }, jwtSecret, {
    expiresIn: '1h',
  });

  console.log('Generated Token:', token); // Log the token to verify

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('jwt', token, {
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000,
  });
};

const clearToken = (res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: false,
    expires: new Date(0),
  });
};

export { generateToken, clearToken };
