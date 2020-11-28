import { Handler } from 'express';

export default function (...whitelist: string[]): Handler {
  if (process.env.CORS) whitelist.push(...process.env.CORS.split(','));
  return (req, res, next) => {
    const origin = req.get('origin');
    if (origin && whitelist.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, *');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE');
    }
    next();
  };
}
