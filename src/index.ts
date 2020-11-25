import { MemoryStore } from 'express-session';
import cors from './cors';
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
  delay: 1000,
};

type AuthOptions = WithDefaults<
  MiddlewareOptions & RouterOptions,
  typeof defaultOptions
>;

export default function useAuth(o: AuthOptions) {
  const options = { ...defaultOptions, ...o };
  return [middleware(options), router(options)];
}
