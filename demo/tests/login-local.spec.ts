import { expect } from 'chai';
import request from 'supertest';
import app from '../app';
import initUsers from './init-users';

describe('Login Local', () => {
  before(initUsers);

  it('Logs in to test account', () =>
    request(app)
      .post('/auth/login')
      .send({ email: 'test', password: 'test' })
      .then((response) => {
        expect(response.body.id).to.not.be.null;
        expect(response.body.email).to.equal('test');
      }));

  it('Cannot login with wrong password', () =>
    request(app)
      .post('/auth/login')
      .send({ email: 'test', password: 'wrong' })
      .expect(401));
});
