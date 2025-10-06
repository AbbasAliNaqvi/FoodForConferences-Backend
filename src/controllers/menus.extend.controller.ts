import { Request, Response, NextFunction } from 'express';
import Menu from '../models/Menu';
import logger from '../utils/logger';

// GET /api/menus/:menuId — fetch a single menu
export const getMenuById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menu = await Menu.findById(req.params.menuId);
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    res.json(menu);
  } catch (err) {
    logger.error('Get menu by id error', err as Error);
    next(err);
  }
};
