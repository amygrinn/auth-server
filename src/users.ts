export interface BaseUser {
  id: string;
  email: string;
  password?: string;
  provider: string;
}

export default interface BaseUsers<User extends BaseUser = BaseUser> {
  create: (user: User) => Promise<User>;
  findByEmail: (email: string) => Promise<User | null>;
  findAndUpdate: (user: User) => Promise<any>;
  findAndDestroy: (user: User) => Promise<any>;
  sanitize: (user: User) => Partial<User>;
}
