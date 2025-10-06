import { Request, Response, NextFunction } from 'express';
import Event from '../models/Event';
import logger from '../utils/logger';

// POST /api/events/:id/vendors — add vendor to event
export const addVendorToEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventId = req.params.id;
    const { vendorId } = req.body;
    if (!vendorId) return res.status(400).json({ message: 'vendorId is required' });

    const ev = await Event.findById(eventId);
    if (!ev) return res.status(404).json({ message: 'Event not found' });

    if (!ev.vendorIds.includes(vendorId)) {
      ev.vendorIds.push(vendorId);
      await ev.save();
    }

    res.json({ success: true, vendorIds: ev.vendorIds });
  } catch (err) {
    logger.error('Add vendor error', err as Error);
    next(err);
  }
};
