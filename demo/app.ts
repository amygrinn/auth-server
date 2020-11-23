import bodyParser from 'body-parser';
import express from 'express';
import useAuth, { cors } from '../lib';
import sendCode from './send-code';

const app = express();
export default app;

const [authMiddleware, authRouter] = useAuth({
  secret: 'SUPER-SECRET',
  sendCode,
  delay: 0,
});

app.use(
  bodyParser.json(),
  authMiddleware,
  cors('http://10.0.0.3:8081', 'https://tylergrinn.github.io')
);

app.use('/auth', authRouter);
