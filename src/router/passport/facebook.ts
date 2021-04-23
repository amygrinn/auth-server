import { Strategy as FacebookStrategy } from 'passport-facebook';
import { v4 as id } from 'uuid';
import type { RouterOptions } from '..';

type FacebookOptions = Required<
  Pick<RouterOptions, 'Users' | 'facebook' | 'authBaseUrl'>
>;

export default ({ Users, facebook, authBaseUrl }: FacebookOptions) =>
  new FacebookStrategy(
    {
      clientID: facebook.clientID,
      clientSecret: facebook.clientSecret,
      callbackURL: authBaseUrl + '/facebook/callback',
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: any,
      done: (err: any, user?: any, info?: { message: string }) => void
    ) => {
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
          provider: 'facebook',
        });
      } else if (user.provider !== 'facebook') {
        user.provider = 'facebook';
        user.password = undefined;
        await Users.findAndUpdate(user);
      }

      return done(null, user);
    }
  );
