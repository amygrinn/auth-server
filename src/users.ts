export interface BaseUser {
  id: string;
  email: string;
  password: string;
}

export default interface BaseUsers<User extends BaseUser = BaseUser> {
  findByEmail: (email: string) => Promise<User | undefined>;
  findById: (id: string) => Promise<User | undefined>;
  create: (user: User) => Promise<User>;
  update: (user: User) => Promise<User>;
  delete: (user: User) => Promise<void>;
  sanitize: (user: User) => Partial<User>;
}
