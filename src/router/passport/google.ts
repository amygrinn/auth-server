import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { v4 as id } from 'uuid';
import type { RouterOptions } from '../';

type GoogleOptions = Required<
  Pick<RouterOptions, 'Users' | 'google' | 'authBaseUrl'>
>;

export default ({ Users, google, authBaseUrl }: GoogleOptions) =>
  new GoogleStrategy(
    {
      clientID: google.clientID,
      clientSecret: google.clientSecret,
      callbackURL: authBaseUrl + '/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      if (!profile.emails || profile.emails.length < 1) {
        return done(null, null, {
          message:
            "Email not included in profile. If you are the developer, make sure to include the 'email' scope when creating oauth keys",
        });
      }

      const email = profile.emails[0].value;

      let user = await Users.findByEmail(email);
      if (!user) {
        user = await Users.create({
          id: id(),
          email,
          provider: 'google',
        });
      } else if (user.provider !== 'google') {
        user.provider = 'google';
        await Users.findAndUpdate(user);
      }

      return done(null, user);
    }
  );
