import logger from '../utils/logger';

export const initJobs = () => {
  // In production, initialize Redis connection and job processors.
  logger.info('Jobs init (stub) - implement BullMQ/Agenda etc. for email, reports.');
};

export const addEmailJob = async (payload: any) => {
  // push job to queue
  logger.info('Add email job (stub)', payload);
};
