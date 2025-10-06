import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import OrderService from '../services/order.service';
import logger from '../utils/logger';
import { generateQrToken } from '../utils/qr';
import { ioEmitOrderUpdate } from '../socket';

// New function to fetch all orders for the current user
export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attendeeId = req.currentUser?.id;

    if (!attendeeId) {
      return res.status(401).json({ message: 'User not authenticated or ID is missing.' });
    }

    // Find all orders associated with the logged-in attendee and sort by newest first
    const orders = await Order.find({ attendeeId: attendeeId })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    logger.error('Get orders list error', err as Error);
    next(err);
  }
};

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
// File: src/controllers/orders.controller.ts

// Get single order (securely)
export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = req.params.id;
    const attendeeId = req.currentUser?.id; // ID set by authMiddleware

    if (!attendeeId) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    // CRITICAL FIX: Find the order by ID AND confirm it belongs to the authenticated user (attendeeId).
    const order = await Order.findOne({ 
        _id: orderId, 
        attendeeId: attendeeId // Assuming your Order model saves this field
    });

    if (!order) {
        // Return 404 if order doesn't exist OR doesn't belong to the user
        return res.status(404).json({ message: 'Order not found.' }); 
    }
    
    res.json(order);
  } catch (err) {
    logger.error('Get order error', err as Error);
    // If CastError occurs, it means the ID format is wrong (which the frontend fixed, 
    // but the 500 error will still display from here if it happens).
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