import { Router } from 'express';
import { createMenu, getMenusByEvent } from '../controllers/menus.controller';
import authMiddleware, { requireRole } from '../middlewares/auth.middleware';

const router = Router();

// create menu (vendor)
router.post('/', authMiddleware, requireRole('vendor'), createMenu);

// get menus for event
router.get('/event/:eventId', getMenusByEvent);

export default router;
