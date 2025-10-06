import { Router } from 'express';
import VendorController from '../controllers/vendors.controller';

const router = Router();

// GET /api/vendors?sort=popular
router.get('/', VendorController.getVendors);

export default router;
