import { MemoryStore } from 'express-session';
import cors from './cors';
import envOptions from './env-options';
import MemoryUsers from './memory-users';
import middleware, { MiddlewareOptions } from './middleware';
import router, { RouterOptions } from './router';
import { BaseUser, BaseUsers } from './users';

export { BaseUsers, BaseUser, MemoryUsers, MemoryStore, cors };

type WithDefaults<Options, Defaults extends Partial<Options>> = Omit<
  Options,
  keyof Defaults
> &
  Partial<Pick<Options, keyof Pick<Defaults, keyof Options>>>;

const defaultOptions = {
  store: new MemoryStore(),
  delay: 0,
  httpOnly: true,
};

export type AuthOptions<
  User extends BaseUser = BaseUser,
  Users extends BaseUsers<User> = BaseUsers<User>
> = WithDefaults<
  MiddlewareOptions & RouterOptions<User, Users>,
  typeof defaultOptions & typeof envOptions & { Users: Users }
>;

export default function useAuth<
  User extends BaseUser = BaseUser,
  Users extends BaseUsers<User> = BaseUsers<User>
>(authOptions: AuthOptions<User, Users>) {
  const options = { ...defaultOptions, ...authOptions, ...envOptions };
  if (!options.secret)
    throw new Error(
      'Auth requires the secret option to be set either in the options or the `AUTH_SECRET` environment variable'
    );

  if (!options.Users) {
    options.Users = MemoryUsers as any as Users;
  }

  return [
    middleware(options as MiddlewareOptions),
    router(options as any as RouterOptions),
  ];
}
