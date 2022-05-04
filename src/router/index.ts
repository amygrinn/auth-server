import { Handler, Router } from 'express';
import { Store } from 'express-session';
import passport from 'passport';
import type { BaseUser, BaseUsers } from '../users';
import initPassport, { Strategy } from './passport';
import resetPasswordRouter from './reset-password';

declare module 'express-session' {
  interface SessionData {
    originalUrl: string;
  }
}

export interface RouterOptions<
  User extends BaseUser = BaseUser,
  Users extends BaseUsers<User> = BaseUsers<User>
> {
  Users: Users;
  sendCode: (email: string, code: string) => Promise<any>;
  store: Store;
  delay: number;
  authBaseUrl?: string;
  google?: {
    clientID: string;
    clientSecret: string;
    scope?: string[];
  };
  github?: {
    clientID: string;
    clientSecret: string;
    scope?: string[];
  };
  facebook?: {
    clientID: string;
    clientSecret: string;
    scope?: string[];
    profileFields?: string[];
  };
}

const authenticate =
  (strategy: Strategy, options = {}): Handler =>
  (req, res, next) => {
    passport.authenticate(strategy, options, (err, user, info) => {
      if (err) return next(err);
      if (!user)
        return res
          .status(401)
          .json({ error: info.message || 'Authentication error' });
      return req.login(user, next);
    })(req, res, next);
  };

export default (options: RouterOptions) => {
  const { Users, delay } = options;
  initPassport(options);

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

  authRouter.use('/reset-password', resetPasswordRouter(options));

  if (options.google) {
    const scope = ['email'].concat(options.google.scope || []);
    authRouter.get('/google', (req, res, next) => {
      authenticate('google', {
        scope,
        state: req.query.redirect,
      })(req, res, next);
    });

    authRouter.get('/google/callback', authenticate('google'), (req, res) =>
      res.redirect(req.query.state as string)
    );
  }

  if (options.github) {
    const scope = ['user:email'].concat(options.github.scope || []);
    authRouter.get('/github', (req, res, next) => {
      authenticate('github', {
        scope,
        state: req.query.redirect,
      })(req, res, next);
    });

    authRouter.get('/github/callback', authenticate('github'), (req, res) =>
      res.redirect(req.query.state as string)
    );
  }

  if (options.facebook) {
    const scope = ['email'].concat(options.facebook.scope || []);
    authRouter.get('/facebook', (req, res, next) => {
      authenticate('facebook', {
        scope,
        state: req.query.redirect,
      })(req, res, next);
    });

    authRouter.get('/facebook/callback', authenticate('facebook'), (req, res) =>
      res.redirect(req.query.state as string)
    );
  }

  authRouter.route('/user').delete(async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Not logged in' });
    await Users.findAndDestroy(req.user as any);
    req.logout();
    return res.json({ success: true });
  });

  return authRouter;
};
