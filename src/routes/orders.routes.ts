import { Router } from 'express';
import { createOrder, getOrder, verifyQr } from '../controllers/orders.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// create order (attendee)
router.post('/', authMiddleware, createOrder);

// get order
router.get('/:id', authMiddleware, getOrder);

// verify QR (vendor/staff scans)
router.post('/:id/verify-qr', authMiddleware, verifyQr);

export default router;
