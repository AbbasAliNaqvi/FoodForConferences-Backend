import { Router } from 'express';
import { markOrderPaid } from '../controllers/orders.extend.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// POST /api/orders/:id/pay
router.post('/:id/pay', authMiddleware, markOrderPaid);

export default router;
