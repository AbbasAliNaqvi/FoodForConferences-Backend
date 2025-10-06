import { Router } from 'express';
import { getMenuById } from '../controllers/menus.extend.controller';

const router = Router();

// GET /api/menus/:menuId
router.get('/:menuId', getMenuById);

export default router;
