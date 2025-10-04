import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import logger from '../utils/logger';

let io: Server | null = null;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: { origin: '*' } // restrict in production
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on('joinOrderRoom', (orderId: string) => {
      socket.join(`order_${orderId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  logger.info('Socket.io initialized');
};

export const ioEmitOrderUpdate = (orderId: string, payload: any) => {
  if (!io) return;
  io.to(`order_${orderId}`).emit('order:update', payload);
};
