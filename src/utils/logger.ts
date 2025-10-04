const info = (msg: string, meta?: any) => console.log(`[INFO] ${msg}`, meta || '');
const warn = (msg: string, meta?: any) => console.warn(`[WARN] ${msg}`, meta || '');
const error = (msg: string, meta?: any) => console.error(`[ERROR] ${msg}`, meta || '');

export default { info, warn, error };
