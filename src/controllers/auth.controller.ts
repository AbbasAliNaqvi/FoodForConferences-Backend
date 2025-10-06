// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import Vendor from '../models/vendor'; 
import config from '../config';
import logger from '../utils/logger';

// Helper to sign JWT tokens
const signToken = (payload: object, expiresIn = config.jwtExpiresIn) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn });

// Register Validators
export const registerValidators = [
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 4 }),
  body('role').optional().isIn(['attendee', 'organizer', 'vendor', 'staff', 'admin'])
];

// Register Handler
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: 'Email already registered' });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      passwordHash,
      role: role || 'attendee'
    });

    // If the user is a vendor, create a vendor record
    if (newUser.role === 'vendor') {
      await Vendor.create({
        name: newUser.name,
        rating: 0,
        cuisine: 'Not set',
        logoUrl: '',
        description: 'No description added yet.',
        contactEmail: newUser.email,
      });
      logger.info(`Vendor profile created for user: ${newUser.email}`);
    }

    // Generate JWT token
    const token = signToken({ id: newUser._id });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (err) {
    logger.error('Register error', err as Error);
    next(err);
  }
};

// Login Validators
export const loginValidators = [
  body('email').isEmail(),
  body('password').isString().notEmpty()
];

// Login Handler
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken({ id: user._id });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    logger.error('Login error', err as Error);
    next(err);
  }
};
