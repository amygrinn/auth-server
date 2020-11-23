// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest-session');
import app from '../app';
import initUsers from './init-users';

describe('Delete user', () => {
  let session: any;

  before(() => {
    session = request(app);
    return initUsers();
  });

  it('Logs in', () =>
    session
      .post('/auth/login')
      .send({ email: 'test', password: 'test' })
      .expect(200));

  it('Deletes a user', () => session.delete('/auth/user').expect(200));

  it('Can no longer log in', () => session.post('/auth/verify').expect(404));
});
