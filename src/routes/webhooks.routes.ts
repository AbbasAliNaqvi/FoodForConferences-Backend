import express from 'express';
import { handleWebhook } from '../services/stripe.service';

const router = express.Router();

router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      const sig = req.headers['stripe-signature'];
      const event = await handleWebhook(req.body, sig);
      console.log('Stripe Event received:', event.type);
      res.status(200).send('Received');
    } catch (err) {
      console.error('Stripe webhook error', err);
      res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }
  }
);

export default router;
