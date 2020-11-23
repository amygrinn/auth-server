import { expect } from 'chai';
import request from 'supertest';
import app from '../app';
import initUsers from './init-users';

describe('Register Local', () => {
  before(initUsers);

  it('Creates an account', () =>
    request(app)
      .post('/auth/register')
      .send({ email: 'new', password: 'test' })
      .expect(200)
      .then((response) => {
        expect(response.body.email).to.equal('new');
        expect(response.body.id).to.not.be.null;
      }));

  it('Cannot create an account with existing username', () =>
    request(app)
      .post('/auth/register')
      .send({ email: 'test', password: 'test' })
      .expect(401));
});
