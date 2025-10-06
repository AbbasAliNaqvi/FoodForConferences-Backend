import { Router } from 'express';
import { addVendorToEvent } from '../controllers/events.extend.controller';
import authMiddleware, { requireRole } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/events/:id/vendors (organizer only)
router.post('/:id/vendors', authMiddleware, requireRole('organizer'), addVendorToEvent);

export default router;
