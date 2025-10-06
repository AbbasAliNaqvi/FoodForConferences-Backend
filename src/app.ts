import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { json, urlencoded } from 'express';
import connectDB from './db/mongo';
import config from './config';
import authRoutes from './routes/auth.routes';
import eventsRoutes from './routes/events.routes';
import menusRoutes from './routes/menus.routes';
import ordersRoutes from './routes/orders.routes';
import errorMiddleware from './middlewares/error.middleware';
import { initJobs } from './jobs/queue';
import paymentRoutes from './routes/payments.routes';
import webhookRoutes from './routes/webhooks.routes';
import eventExtendRoutes from './routes/events.extend.routes';
import vendorsRoutes from './routes/vendors.routes';
import menuExtendRoutes from './routes/menus.extend.routes';
import orderExtendRoutes from './routes/orders.extend.routes';
import analyticsRoutes from './routes/analytics.routes';

// initialize DB connection
connectDB(); // yahan mongo se connect karega

const app = express();
app.disable('etag');
// security middlewares
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(compression());

// logging
app.use(morgan('dev'));
app.use('/api/webhooks', webhookRoutes); 

// body parsers
app.use(json());
app.use(urlencoded({ extended: true }));

// health check
app.get('/health', (_req, res) => res.json({ ok: true, env: config.nodeEnv }));

// Api routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/menus', menusRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/events', eventExtendRoutes);
app.use('/api/menus', menuExtendRoutes);
app.use('/api/orders', orderExtendRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/vendors', vendorsRoutes);

// global error handler
app.use(errorMiddleware);

// init background jobs (Bull/Redis etc.)
initJobs();

export default app;
