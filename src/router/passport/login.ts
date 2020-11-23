import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import BaseUsers from '../../users';

export default (Users: BaseUsers) =>
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      const user = await Users.findByEmail(email);

      if (!user) {
        done(null, false, { message: 'User does not exist' });
      } else if (!(await bcrypt.compare(password, user.password))) {
        done(null, false, { message: 'Incorrect password' });
      } else {
        done(null, user);
      }
    }
  );
