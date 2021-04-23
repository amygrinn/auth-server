import passport from 'passport';
import type { RouterOptions } from '../';
import facebook from './facebook';
import github from './github';
import google from './google';
import login from './login';
import register from './register';
import twitter from './twitter';

export type Strategy =
  | 'register-local'
  | 'login-local'
  | 'google'
  | 'twitter'
  | 'github'
  | 'facebook';

export default function init(options: RouterOptions) {
  const { Users } = options;

  passport.serializeUser<{ email: string }, string>((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser<{ email: string }, string>((email: string, done) => {
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

    if (options.twitter) {
      passport.use('twitter', twitter(options as any));
    }

    if (options.facebook) {
      passport.user('facebook', facebook(options as any));
    }
  }
}
