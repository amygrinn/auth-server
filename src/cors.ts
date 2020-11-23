import { Handler } from 'express';

export default function (...whitelist: string[]): Handler {
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
