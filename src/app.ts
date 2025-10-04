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

// initialize DB connection
connectDB(); // yahan mongo se connect karega

const app = express();

// security middlewares
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(compression());

// logging
app.use(morgan('dev'));

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

// stripe webhook placeholder - raw body required at runtime; route added in orders.controller if needed

// global error handler
app.use(errorMiddleware);

// init background jobs (Bull/Redis etc.)
initJobs();

export default app;
