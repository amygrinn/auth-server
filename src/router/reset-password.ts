import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Request, Response, Router } from 'express';
import BaseUsers from '../users';

declare module 'express-session' {
  interface SessionData {
    reset: {
      email: string;
      code: string;
      expires: string;
    };
  }
}

interface ResetPasswordRouterOptions {
  sendCode: (email: string, code: string) => Promise<any>;
  Users: BaseUsers;
}

// Send non-descript messages for all events
const ERR = (res: Response) => res.status(400).json({ error: 'Bad request' });
const SUCCESS = (res: Response) => res.json({ success: true });

export default function resetPasswordRouter({
  sendCode,
  Users,
}: ResetPasswordRouterOptions) {
  const router = Router();

  router.post('/', async (req, res) => {
    const {
      body: { email },
    } = req;

    if (!email) {
      return ERR(res);
    }

    const user = await Users.findByEmail(email);
    if (!user) return ERR(res);

    const expires = new Date();
    expires.setHours(expires.getHours() + 3);

    const code = crypto
      .randomBytes(4)
      .toString('hex')
      .toUpperCase()
      .replace(/(.{4})(.{4})/, '$1-$2');

    req.session.reset = { email, code, expires: expires.toUTCString() };

    await sendCode(email, code);
    return SUCCESS(res);
  });

  const authenticate = (req: Request, email: string, code: string) =>
    !!req.session.reset &&
    req.session.reset.email === email &&
    req.session.reset.code === code &&
    Date.parse(req.session.reset.expires) >= Date.now();

  router.get('/verify', async (req, res) => {
    const {
      query: { email, code },
    } = req;

    if (
      !email ||
      !code ||
      typeof email !== 'string' ||
      typeof code !== 'string'
    )
      return ERR(res);

    if (authenticate(req, email, code)) return SUCCESS(res);

    return ERR(res);
  });

  router.post('/reset', async (req, res) => {
    const {
      body: { email, code, password },
    } = req;

    const user = await Users.findByEmail(email);
    if (!user) return ERR(res);

    if (!email || !code || !password) return ERR(res);

    if (authenticate(req, email, code)) {
      const hash = await bcrypt.hash(password, 10);
      user.password = hash;
      user.provider = 'local';
      await Users.findAndUpdate(user);
      req.session.reset = undefined;

      return SUCCESS(res);
    }

    return ERR(res);
  });

  return router;
}
