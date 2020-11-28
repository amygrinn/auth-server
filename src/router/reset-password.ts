import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Response, Router } from 'express';
import BaseUsers from '../users';

interface ResetState {
  email: string;
  code: string;
  expires: string;
}

declare module 'express-session' {
  interface SessionData {
    reset: ResetState;
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

  // Always send 200 response regardless of errors
  router.post('/', async (req, res) => {
    const {
      body: { email },
    } = req;

    if (!email) {
      return SUCCESS(res);
    }

    const user = await Users.findByEmail(email);
    if (!user) return SUCCESS(res);

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

  const authenticate = (reset: ResetState, email: string, code: string) =>
    reset.email === email &&
    reset.code === code &&
    Date.parse(reset.expires) >= Date.now();

  router.get('/verify', async (req, res) => {
    const {
      query: { email, code },
    } = req;

    if (
      !req.session.reset ||
      !email ||
      !code ||
      typeof email !== 'string' ||
      typeof code !== 'string'
    )
      return ERR(res);

    if (authenticate(req.session.reset, email, code)) return SUCCESS(res);

    return ERR(res);
  });

  router.post('/reset', async (req, res) => {
    const {
      body: { email, code, password },
    } = req;

    const user = await Users.findByEmail(email);
    if (!user) return ERR(res);

    if (!req.session.reset || !email || !code || !password) return ERR(res);

    if (authenticate(req.session.reset, email, code)) {
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
