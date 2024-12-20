import { Request, Response } from 'express';
import { User as UserInterface } from '../../interfaces/User';

export const verifyOwnership = (
  req: Request,
  res: Response,
  targetUserId: number
): boolean => {
  const user = req.user as UserInterface;

  if (user.id !== targetUserId) {
    res.status(403).json({ message: 'Forbidden: Access denied' });
    return false;
  }

  return true;
};
