import { Request, Response } from 'express';
import StripeService from '../services/stripe.service';
import logger from '../utils/logger';

const createIntent = async (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.body;
    if (!amount) return res.status(400).json({ message: 'Amount is required' });

    const paymentIntent = await StripeService.createPaymentIntent(amount, currency || 'inr');
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    logger.error('Create PaymentIntent error', err as Error);
    res.status(500).json({ message: 'PaymentIntent creation failed' });
  }
};

export default { createIntent };
