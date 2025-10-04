import { UserDocument } from '../models/User';
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      currentUser?: Partial<UserDocument> | null;
    }
  }
}