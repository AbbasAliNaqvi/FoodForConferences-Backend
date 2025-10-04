import Stripe from 'stripe';
import config from '../config';
import logger from '../utils/logger';

const stripe = new Stripe(config.stripeSecret || '', { apiVersion: '2022-11-15' });

export const createPaymentIntent = async (amount: number, currency = 'usd') => {
  // amount in cents expected
  try {
    const pi = await stripe.paymentIntents.create({
      amount,
      currency,
      // Add metadata if needed
    });
    return pi;
  } catch (err) {
    logger.error('Stripe createPaymentIntent error', err as Error);
    throw err;
  }
};

export const handleWebhook = async (rawBody: Buffer, signature: string | undefined) => {
  // yahan webhook signature verify karega
  try {
    if (!config.stripeWebhookSecret) throw new Error('Stripe webhook secret not configured');
    const event = stripe.webhooks.constructEvent(rawBody, signature || '', config.stripeWebhookSecret);
    // handle events
    return event;
  } catch (err) {
    logger.error('Stripe webhook error', err as Error);
    throw err;
  }
};

export default { createPaymentIntent, handleWebhook };
