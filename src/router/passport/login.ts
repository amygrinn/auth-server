import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import { RouterOptions } from '../';

export default ({ Users }: RouterOptions) =>
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      const user = await Users.findByEmail(email);

      if (!user) {
        done(null, false, { message: 'User does not exist' });
      } else if (!user.password) {
        done(null, false, { message: 'User is not registered locally' });
      } else if (!(await bcrypt.compare(password, user.password))) {
        done(null, false, { message: 'Incorrect password' });
      } else {
        done(null, user);
      }
    }
  );
