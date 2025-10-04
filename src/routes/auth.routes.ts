import { Router } from 'express';
import { register, login, registerValidators, loginValidators } from '../controllers/auth.controller';

const router = Router();

// POST /api/auth/register
router.post('/register', registerValidators, register);

// POST /api/auth/login
router.post('/login', loginValidators, login);

export default router;
