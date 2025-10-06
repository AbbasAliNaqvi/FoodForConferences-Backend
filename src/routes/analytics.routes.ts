import { Router } from 'express';
import { getEventAnalytics } from '../controllers/analytics.controller';
import authMiddleware, { requireRole } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/analytics/event/:id (organizer only)
router.get('/event/:id', authMiddleware, requireRole('organizer'), getEventAnalytics);

export default router;
