import request from 'supertest';
import { MemoryUsers } from '../..';
import app from '../app';

export default () => {
  MemoryUsers.clear();

  return request(app)
    .post('/auth/register')
    .send({ email: 'test', password: 'test' });
};
