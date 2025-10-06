import { Router } from 'express';
import { createOrder, getOrder, getOrders, verifyQr } from '../controllers/orders.controller'; 
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

//This route handles the list request from the frontend's OrdersScreen
router.get('/', authMiddleware, getOrders); 

// create order (attendee)
router.post('/', authMiddleware, createOrder); 

// get single order (by ID)
router.get('/:id', authMiddleware, getOrder);

// verify QR (vendor/staff scans)
router.post('/:id/verify-qr', authMiddleware, verifyQr);

export default router;