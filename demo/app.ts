import bodyParser from 'body-parser';
import express from 'express';
import useAuth, { cors } from '../lib';
import sendCode from './send-code';

const app = express();
export default app;

const [authMiddleware, authRouter] = useAuth({ sendCode });

app.use(bodyParser.json(), authMiddleware, cors());

app.use('/auth', authRouter);
