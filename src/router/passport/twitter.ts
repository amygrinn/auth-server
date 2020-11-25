import axios from 'axios';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { v4 as id } from 'uuid';
import type { RouterOptions } from '..';

type TwitterOptions = Required<
  Pick<RouterOptions, 'Users' | 'twitter' | 'authBaseUrl'>
>;

export default ({ Users, twitter, authBaseUrl }: TwitterOptions) =>
  new TwitterStrategy(
    {
      consumerKey: twitter.consumerKey,
      consumerSecret: twitter.consumerSecret,
      callbackURL: authBaseUrl + '/twitter/callback',
    },
    async (
      key: string,
      secret: string,
      _profile: any,
      done: (err: any, user?: any, info?: { message: string }) => void
    ) => {
      // Get twitter email
      const oauth = new OAuth({
        consumer: {
          key: twitter.consumerKey,
          secret: twitter.consumerSecret,
        },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
          return crypto
            .createHmac('sha1', key)
            .update(base_string)
            .digest('base64');
        },
      });

      const params = new URLSearchParams({
        include_entities: false,
        skip_status: true,
        include_email: true,
      } as any);

      const url = new URL(
        'https://api.twitter.com/1.1/account/verify_credentials.json'
      );
      url.search = params.toString();

      const headers = oauth.toHeader(
        oauth.authorize({ url: url.href, method: 'GET' }, { key, secret })
      );

      let email: string;

      try {
        const { data } = await axios.get(url.href, { headers });
        email = data.email;
      } catch (err) {
        return done(err);
      }

      let user = await Users.findByEmail(email);
      if (!user) {
        user = await Users.create({
          id: id(),
          email,
          provider: 'twitter',
        });
      } else if (user.provider !== 'twitter') {
        user.provider = 'twitter';
        await Users.findAndUpdate(user);
      }

      return done(null, user);
    }
  );
