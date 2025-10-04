import { Router } from 'express';
import PaymentController from '../controllers/payments.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// POST /api/payments/create-intent
router.post('/create-intent', authMiddleware, PaymentController.createIntent);

export default router;
