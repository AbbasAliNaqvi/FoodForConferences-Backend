import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import config from '../config';
import { body, validationResult } from 'express-validator';
import logger from '../utils/logger';

// Helper to sign tokens
const signToken = (payload: object, expiresIn = config.jwtExpiresIn) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn });

// Register handler
export const registerValidators = [
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
];

export const register = async (req: Request, res: Response, next: NextFunction) => {
  // yahan user initiate hoga
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ name, email, passwordHash, role: role || 'attendee' });
    await user.save();

    // Create token
    const token = signToken({ id: user._id });
    // TODO: create and store refresh token in DB

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    logger.error('Register error', err as Error);
    next(err);
  }
};

// Login handler
export const loginValidators = [
  body('email').isEmail(),
  body('password').isString().notEmpty()
];

export const login = async (req: Request, res: Response, next: NextFunction) => {
  // yahan login ka logic likh rhaa hoon
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken({ id: user._id });
    // TODO: create refresh token & send as HttpOnly cookie or in response

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    logger.error('Login error', err as Error);
    next(err);
  }
};
