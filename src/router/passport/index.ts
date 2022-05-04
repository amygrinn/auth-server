import passport from 'passport';
import type { RouterOptions } from '../';
import facebook from './facebook';
import github from './github';
import google from './google';
import login from './login';
import register from './register';

export type Strategy =
  | 'register-local'
  | 'login-local'
  | 'google'
  | 'github'
  | 'facebook';

export default function init(options: RouterOptions) {
  const { Users } = options;

  passport.serializeUser((user, done) => {
    done(null, (user as any).email);
  });

  passport.deserializeUser((email: string, done) => {
    Users.findByEmail(email).then((user) => done(null, user || undefined));
  });

  passport.use('register-local', register(options));
  passport.use('login-local', login(options));

  if (options.authBaseUrl) {
    if (options.google) {
      passport.use('google', google(options as any));
    }

    if (options.github) {
      passport.use('github', github(options as any));
    }

    if (options.facebook) {
      passport.use('facebook', facebook(options as any));
    }
  }
}
