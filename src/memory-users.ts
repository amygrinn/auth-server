import BaseUsers, { BaseUser } from './users';

const users: BaseUser[] = [];

interface MemoryUsers extends BaseUsers {
  clear: () => void;
}

const MemoryUsers: MemoryUsers = class MemoryUsers {
  public static findByEmail(email: string) {
    return Promise.resolve(users.find((u) => u.email === email));
  }

  public static findById(id: string) {
    return Promise.resolve(users.find((u) => u.id === id));
  }

  public static async create(user: BaseUser) {
    const existing = await MemoryUsers.findById(user.id);
    if (existing) return Promise.reject(new Error('User already exists'));
    users.push(user);
    return Promise.resolve(user);
  }

  public static update(user: BaseUser) {
    const i = users.findIndex((u) => u.id === user.id);
    if (i >= 0) {
      users[i] = user;
      return Promise.resolve(user);
    }
    return Promise.reject(new Error('User does not exist'));
  }

  public static delete(user: BaseUser) {
    const i = users.findIndex((u) => u.id === user.id);
    if (i >= 0) {
      users.splice(i, 1);
      return Promise.resolve();
    }
    return Promise.reject(new Error('User does not exist'));
  }

  public static sanitize(user: BaseUser) {
    return {
      id: user.id,
      email: user.email,
    };
  }

  public static clear() {
    users.length = 0;
  }
};

export default MemoryUsers;
