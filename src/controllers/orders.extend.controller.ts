import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import logger from '../utils/logger';

// POST /api/orders/:id/pay — update order as paid
export const markOrderPaid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = req.params.id;
    const { paymentIntentId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.paymentStatus = 'paid';
    order.orderStatus = 'queued';
    await order.save();

    logger.info(`✅ Order ${orderId} marked as paid via ${paymentIntentId || 'manual update'}`);
    res.json({ success: true, order });
  } catch (err) {
    logger.error('Mark order paid error', err as Error);
    next(err);
  }
};
