import crypto from 'crypto';

export const generateQrToken = (len = 24) => {
  return crypto.randomBytes(len).toString('hex'); // secure random token
};
