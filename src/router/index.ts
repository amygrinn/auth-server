import { Handler, Router } from 'express';
import { Store } from 'express-session';
import passport from 'passport';
import type BaseUsers from '../users';
import initPassport, { Strategy } from './passport';
import resetPasswordRouter from './reset-password';

interface RouterOptions {
  Users: BaseUsers;
  sendCode: (email: string, code: string) => Promise<any>;
  store: Store;
  delay: number;
}

const authenticate = (strategy: Strategy): Handler => (req, res, next) => {
  passport.authenticate(strategy, (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res
        .status(401)
        .json({ error: info.message || 'Authentication error' });
    return req.login(user, next);
  })(req, res, next);
};

export default ({ Users, store, sendCode, delay }: RouterOptions) => {
  initPassport({ Users });

  const authRouter = Router();

  // Delay all requests
  authRouter.use((_req, _res, next) => {
    setTimeout(next, delay);
  });

  const sendUser: Handler = (req, res) => {
    if (req.user) return res.json(Users.sanitize(req.user as any));
    return res.status(401).json({ error: 'Not logged in' });
  };

  authRouter.post('/register', authenticate('register-local'), sendUser);

  authRouter.post('/login', authenticate('login-local'), sendUser);

  authRouter.get('/verify', sendUser);

  authRouter.put('/logout', (req, res) => {
    req.logout();
    return res.json({ success: true });
  });

  authRouter.use(
    '/reset-password',
    resetPasswordRouter({ sendCode, store, Users })
  );

  authRouter.route('/user').delete(async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Not logged in' });
    await Users.delete(req.user as any);
    req.logout();
    return res.json({ success: true });
  });

  return authRouter;
};
