import cookieParser from 'cookie-parser';
import { Handler } from 'express';
import session, { Store } from 'express-session';
import passport from 'passport';

const compose = (...handlers: Handler[]): Handler => {
  let head = handlers[0];
  let tail = handlers.slice(1);

  return ((req, res, next) => {
    head(req, res, (err: any) => {
      if (err || !tail.length) return next(err);
      return compose(...tail)(req, res, next);
    });
  }) as Handler;
};

export interface MiddlewareOptions {
  secret: string | string[];
  store: Store;
  cors?: boolean;
}

const TEST = process.env.NODE_ENV === 'test';

export default ({ secret, store, cors }: MiddlewareOptions) =>
  compose(
    cookieParser(secret),
    session({
      secret,
      store,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      proxy: cors,
      name: 'sid',
      cookie:
        cors && !TEST
          ? {
              sameSite: 'none',
              secure: true,
            }
          : {},
    }),
    passport.initialize(),
    passport.session({ pauseStream: true })
  );
