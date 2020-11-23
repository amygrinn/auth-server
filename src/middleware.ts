import cookieParser from 'cookie-parser';
import { Handler } from 'express';
import session, { Store } from 'express-session';
import passport from 'passport';

const compose = (...handlers: Handler[]) => {
  let head = handlers[0];
  let tail = handlers.slice(1);

  return ((req, res, next) => {
    head(req, res, (err: any) => {
      if (err || !tail.length) return next(err);
      return compose(...tail)(req, res, next);
    });
  }) as Handler;
};

interface InitOptions {
  secret: string | string[];
  store: Store;
}

const middleware: (options: InitOptions) => Handler = ({ secret, store }) =>
  compose(
    cookieParser(secret),
    session({
      secret,
      store,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      name: 'sid',
    }),
    passport.initialize(),
    passport.session()
  );

export default middleware;
