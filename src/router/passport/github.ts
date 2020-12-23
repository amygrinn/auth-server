import { Strategy as GithubStrategy } from 'passport-github2';
import { v4 as id } from 'uuid';
import type { RouterOptions } from '..';

type GithubOptions = Required<
  Pick<RouterOptions, 'Users' | 'github' | 'authBaseUrl'>
>;

export default ({ Users, github, authBaseUrl }: GithubOptions) =>
  new GithubStrategy(
    {
      clientID: github.clientID,
      clientSecret: github.clientSecret,
      callbackURL: authBaseUrl + '/github/callback',
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
          provider: 'github',
        });
      } else if (user.provider !== 'github') {
        user.provider = 'github';
        user.password = undefined;
        await Users.findAndUpdate(user);
      }

      return done(null, user);
    }
  );
