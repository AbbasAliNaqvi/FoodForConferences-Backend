
import { Request, Response, NextFunction } from 'express';
import Menu from '../models/Menu';
import logger from '../utils/logger';

// Create menu (vendor)
export const createMenu = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    payload.vendorId = req.currentUser?.id;
    const menu = new Menu(payload);
    await menu.save();
    res.json(menu);
  } catch (err) {
    logger.error('Create menu error', err as Error);
    next(err);
  }
};

// Get menus by event
export const getMenusByEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menus = await Menu.find({ eventId: req.params.eventId });
    res.json(menus);
  } catch (err) {
    logger.error('Get menus error', err as Error);
    next(err);
  }
};
