import bodyParser from 'body-parser';
import express from 'express';
import useAuth, { cors } from '../lib';
import sendCode from './send-code';

const app = express();
export default app;

const [authMiddleware, authRouter] = useAuth({
  secret: process.env.SECRET!,
  sendCode,
  delay: process.env.NODE_ENV === 'test' ? 0 : Number(process.env.DELAY),
  authBaseUrl: process.env.AUTH_BASE_URL,
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  },
  github: {
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  },
  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY!,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET!,
  },
});

app.use(
  bodyParser.json(),
  authMiddleware,
  cors(
    'http://10.0.0.3:8081',
    'http://localhost:8081',
    'https://tylergrinn.github.io'
  )
);

app.use('/auth', authRouter);
