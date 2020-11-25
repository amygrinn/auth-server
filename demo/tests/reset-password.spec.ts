// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest-session');
import app from '../app';
import { currentCode } from '../send-code';
import initUsers from './init-users';

describe('Reset password', () => {
  let session: any;

  before(() => {
    session = request(app);
    return initUsers();
  });

  it('Requests a reset password code', () =>
    session.post('/auth/reset-password').send({ email: 'test' }).expect(200));

  it('Verifies a code', () =>
    session
      .get('/auth/reset-password/verify')
      .query({ email: 'test', code: currentCode })
      .expect(200));

  it('Does not verify an invalid code', () =>
    session
      .get('/auth/reset-password/verify')
      .query({ email: 'test', code: 'wrong' })
      .expect(400));

  it('Does not verify a code with the wrong email address', () =>
    session
      .get('/auth/reset-password/verify')
      .query({ email: 'wrong', code: currentCode })
      .expect(400));

  it('Resets a password', () =>
    session
      .post('/auth/reset-password/reset')
      .send({ email: 'test', code: currentCode, password: 'newpassword' })
      .expect(200));

  it('Cannot reset a password twice', () =>
    session
      .post('/auth/reset-password/reset')
      .send({ email: 'test', code: currentCode, password: 'newpassword' })
      .expect(400));

  it('Can login with new password', () =>
    session
      .post('/auth/login')
      .send({ email: 'test', password: 'newpassword' })
      .expect(200));
});
