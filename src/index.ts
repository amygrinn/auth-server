import { MemoryStore } from 'express-session';
import cors from './cors';
import envOptions from './env-options';
import MemoryUsers from './memory-users';
import middleware, { MiddlewareOptions } from './middleware';
import router, { RouterOptions } from './router';
import BaseUsers, { BaseUser } from './users';

export { BaseUsers, BaseUser, MemoryUsers, MemoryStore, cors };

type WithDefaults<Options, Defaults extends Partial<Options>> = Omit<
  Options,
  keyof Defaults
> &
  Partial<Pick<Options, keyof Pick<Defaults, keyof Options>>>;

const defaultOptions = {
  Users: MemoryUsers,
  store: new MemoryStore(),
  delay: 0,
};

type AuthOptions = WithDefaults<
  MiddlewareOptions & RouterOptions,
  typeof defaultOptions & typeof envOptions
>;

export default function useAuth(authOptions: AuthOptions) {
  const options = { ...defaultOptions, ...authOptions, ...envOptions };
  if (!options.secret)
    throw new Error(
      'Auth requires the secret option to be set either in the options or the `AUTH_SECRET` environment variable'
    );
  return [middleware(options as MiddlewareOptions), router(options)];
}
