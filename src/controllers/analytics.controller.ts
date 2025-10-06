import { Request, Response, NextFunction } from 'express';
import Event from '../models/Event';
import Order from '../models/Order';
import Menu from '../models/Menu';
import logger from '../utils/logger';

// GET /api/analytics/event/:id — event analytics for organizer
export const getEventAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const totalOrders = await Order.countDocuments({ eventId });
    const totalRevenueAgg = await Order.aggregate([
      { $match: { eventId: event._id, paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]);

    const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;
    const vendorsCount = event.vendorIds.length;
    const menusCount = await Menu.countDocuments({ eventId });

    res.json({
      eventId,
      totalOrders,
      totalRevenue,
      vendorsCount,
      menusCount,
    });
  } catch (err) {
    logger.error('Get analytics error', err as Error);
    next(err);
  }
};
