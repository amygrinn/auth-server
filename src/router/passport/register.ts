import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import { v4 as id } from 'uuid';
import BaseUsers from '../../users';

export default (Users: BaseUsers) =>
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      if (await Users.findByEmail(email)) {
        done(null, false, { message: 'User already exists' });
      } else {
        const hash = await bcrypt.hash(password, 10);
        const user = await Users.create({
          id: id(),
          email: email,
          password: hash,
        });
        done(null, user);
      }
    }
  );
