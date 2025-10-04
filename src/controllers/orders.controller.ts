import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import OrderService from '../services/order.service';
import logger from '../utils/logger';
import { generateQrToken } from '../utils/qr';
import { ioEmitOrderUpdate } from '../socket';

// Create order
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // yahan order creation logic - inventory check + total calculation
    const payload = req.body;
    payload.attendeeId = req.currentUser?.id;
    payload.total = (payload.items || []).reduce((s: number, it: any) => s + it.price * it.qty, 0);
    payload.qrToken = generateQrToken();

    // Use OrderService to handle transactional logic (inventory decrement etc.)
    const order = await OrderService.createOrder(payload);

    // Emit socket update
    ioEmitOrderUpdate(order._id.toString(), { orderStatus: order.orderStatus });

    res.json(order);
  } catch (err) {
    logger.error('Create order error', err as Error);
    next(err);
  }
};

// Get order
export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    logger.error('Get order error', err as Error);
    next(err);
  }
};

// Verify QR for pickup
export const verifyQr = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // yahan scan/verify qr token ka logic hoga
    const { token } = req.body;
    const order = await Order.findOne({ qrToken: token });
    if (!order) return res.status(404).json({ message: 'Invalid token' });

    order.orderStatus = 'picked';
    await order.save();

    ioEmitOrderUpdate(order._id.toString(), { orderStatus: order.orderStatus });

    res.json({ ok: true, orderId: order._id });
  } catch (err) {
    logger.error('Verify QR error', err as Error);
    next(err);
  }
};
