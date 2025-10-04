import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import userService from '../services/user.service';
import logger from '../utils/logger';

export const requireRole = (role: string | string[]) => {
  const roles = Array.isArray(role) ? role : [role];
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.currentUser?.role;
    if (!userRole || !roles.includes(userRole)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
};

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // yahan token validate hoga
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: 'No token' });
    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid token format' });

    const token = parts[1];
    try {
      const payload = jwt.verify(token, config.jwtSecret) as any;
      const user = await userService.findById(payload.id);
      if (!user) return res.status(401).json({ message: 'Invalid token user' });
      req.currentUser = { id: user._id, name: user.name, email: user.email, role: user.role };
      next();
    } catch (err) {
      logger.error('JWT verify error', err as Error);
      return res.status(401).json({ message: 'Token invalid or expired' });
    }
  } catch (err) {
    next(err);
  }
};

export default authMiddleware;
