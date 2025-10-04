import http from 'http';
import app from './app';
import { initSocket } from './socket';
import config from './config';
import logger from './utils/logger';

const PORT = config.port;

const server = http.createServer(app);

// Initialize Socket.IO on the same server
initSocket(server);

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});