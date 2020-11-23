import passport from 'passport';
import BaseUsers from '../../users';
import login from './login';
import register from './register';

interface PassportInitOptions {
  Users: BaseUsers;
}

export type Strategy = 'register-local' | 'login-local';

export default function init({ Users }: PassportInitOptions) {
  passport.serializeUser<{ id: string }, string>((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser<{ id: string }, string>((id: string, done) => {
    Users.findById(id).then((user) => done(null, user));
  });

  passport.use('register-local', register(Users));
  passport.use('login-local', login(Users));
}
