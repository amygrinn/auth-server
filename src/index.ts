import { MemoryStore, Store } from 'express-session';
import cors from './cors';
import MemoryUsers from './memory-users';
import middleware from './middleware';
import router from './router';
import BaseUsers, { BaseUser } from './users';

export { BaseUsers, BaseUser, MemoryUsers, MemoryStore, cors };

interface AuthOptions {
  secret: string | string[];
  sendCode: (email: string, code: string) => Promise<any>;
  Users?: BaseUsers;
  store?: Store;
  delay?: number;
}

const defaultOptions = {
  Users: MemoryUsers,
  store: new MemoryStore(),
  delay: 1000,
};

export default function useAuth(o: AuthOptions) {
  const options = { ...defaultOptions, ...o };
  return [middleware(options), router(options)];
}
