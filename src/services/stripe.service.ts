import Stripe from 'stripe';
import config from '../config';
import logger from '../utils/logger';
import User from '../models/User'; 

const stripe = new Stripe(config.stripeSecret || '', { apiVersion: '2022-11-15' });

// Create a PaymentIntent
export const createPaymentIntent = async (
  amount: number, 
  currency = 'usd', 
  metadata: Record<string, any> = {}
) => {
  try {
    const pi = await stripe.paymentIntents.create({
      amount, // in cents
      currency,
      metadata,
    });
    return pi;
  } catch (err) {
    logger.error('Stripe createPaymentIntent error', err as Error);
    throw err;
  }
};

// Handle Stripe webhook
export const handleWebhook = async (rawBody: Buffer, signature: string | undefined) => {
  try {
    if (!config.stripeWebhookSecret) throw new Error('Stripe webhook secret not configured');

    const event = stripe.webhooks.constructEvent(rawBody, signature || '', config.stripeWebhookSecret);

    switch(event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('💰 PaymentIntent succeeded!');
        console.log(`Amount: $${(paymentIntent.amount_received / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()}`);
        console.log(`PaymentIntent ID: ${paymentIntent.id}`);
        console.log(`Customer ID: ${paymentIntent.customer || 'Guest/No customer object'}`);
        console.log('Metadata:', paymentIntent.metadata);

        if (paymentIntent.metadata?.userId) {
          const user = await User.findById(paymentIntent.metadata.userId).lean();
          if (user) {
            console.log('💡 User details:', { name: user.name, email: user.email, _id: user._id });
          } else {
            console.log('⚠️ User not found for userId:', paymentIntent.metadata.userId);
          }
        }
        break;
      }

      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge;
        console.log('💳 Charge succeeded!');
        console.log(`Amount: $${(charge.amount / 100).toFixed(2)} ${charge.currency.toUpperCase()}`);
        console.log(`Charge ID: ${charge.id}`);
        console.log(`PaymentIntent ID: ${charge.payment_intent}`);
        console.log(`Customer ID: ${charge.customer || 'Guest/No customer object'}`);
        console.log('Metadata:', charge.metadata);

        if (charge.metadata?.userId) {
          const user = await User.findById(charge.metadata.userId).lean();
          if (user) {
            console.log('💡 User details:', { name: user.name, email: user.email, _id: user._id });
          } else {
            console.log('⚠️ User not found for userId:', charge.metadata.userId);
          }
        }
        break;
      }

      default:
        console.log('🔔 Unhandled event type:', event.type);
    }

    return event;
  } catch (err) {
    logger.error('Stripe webhook error', err as Error);
    throw err;
  }
};

export default { createPaymentIntent, handleWebhook };
