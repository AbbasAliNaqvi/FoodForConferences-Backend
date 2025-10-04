import { Router } from 'express';
import { createEvent, listEvents, getEvent } from '../controllers/events.controller';
import authMiddleware from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/auth.middleware';

const router = Router();

// public listing
router.get('/', listEvents);
router.get('/:id', getEvent);

// protected - create event (organizer)
router.post('/', authMiddleware, requireRole('organizer'), createEvent);

export default router;
