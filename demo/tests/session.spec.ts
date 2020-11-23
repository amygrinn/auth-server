// / <reference path="./supertest-session.d.ts" />

import requestSession from 'supertest-session';
import app from '../app';
import initUsers from './init-users';

describe('Session', () => {
  let session: any;

  before(() => {
    session = requestSession(app);
    return initUsers();
  });

  it('Logs in', () =>
    session
      .post('/auth/login')
      .send({ email: 'test', password: 'test' })
      .expect(200));

  it('Verifies authentication status', () =>
    session.get('/auth/verify').expect(200));

  it('Logs out', () => session.put('/auth/logout').expect(200));

  it('Cannot verify authentication status', () =>
    session.get('/auth/verify').expect(401));
});
