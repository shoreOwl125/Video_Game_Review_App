import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'testsecret'
    ) as { userId: number };
    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export { authenticate };
