import request from 'supertest';
import app from '../app';
import { currentCode } from '../send-code';
import initUsers from './init-users';

describe('Reset password', () => {
  before(initUsers);

  it('Requests a reset password code', () =>
    request(app)
      .post('/auth/reset-password')
      .send({ email: 'test' })
      .expect(200));

  it('Verifies a code', () =>
    request(app)
      .get('/auth/reset-password/verify')
      .query({ email: 'test', code: currentCode })
      .expect(200));

  it('Does not verify an invalid code', () =>
    request(app)
      .get('/auth/reset-password/verify')
      .query({ email: 'test', code: 'wrong' })
      .expect(401));

  it('Does not verify a code with the wrong email address', () =>
    request(app)
      .get('/auth/reset-password/verify')
      .query({ email: 'wrong', code: currentCode })
      .expect(401));

  it('Resets a password', () =>
    request(app)
      .post('/auth/reset-password/reset')
      .send({ email: 'test', code: currentCode, password: 'newpassword' })
      .expect(200));

  it('Cannot reset a password twice', () =>
    request(app)
      .post('/auth/reset-password/reset')
      .send({ email: 'test', code: currentCode, password: 'newpassword' })
      .expect(401));

  it('Can login with new password', () =>
    request(app)
      .post('/auth/login')
      .send({ email: 'test', password: 'newpassword' })
      .expect(200));
});
