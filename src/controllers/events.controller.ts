import { Request, Response, NextFunction } from 'express';
import Event from '../models/Event';
import logger from '../utils/logger';

// Create event
export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // organizer creates event
    const payload = req.body;
    payload.organizerId = req.currentUser?.id;
    const ev = new Event(payload);
    await ev.save();
    res.json(ev);
  } catch (err) {
    logger.error('Create event error', err as Error);
    next(err);
  }
};

// List events (public)
export const listEvents = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await Event.find().limit(100);
    res.json(events);
  } catch (err) {
    logger.error('List events error', err as Error);
    next(err);
  }
};

// Get event by id
export const getEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    res.json(ev);
  } catch (err) {
    logger.error('Get event error', err as Error);
    next(err);
  }
};
