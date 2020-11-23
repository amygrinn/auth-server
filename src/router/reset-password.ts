import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Router } from 'express';
import { Store } from 'express-session';
import BaseUsers from '../users';

interface ResetPasswordRouterOptions {
  sendCode: (email: string, code: string) => Promise<any>;
  store: Store;
  Users: BaseUsers;
}

export default function resetPasswordRouter({
  sendCode,
  store,
  Users,
}: ResetPasswordRouterOptions) {
  const router = Router();

  const setStoreValue = (key: string, value: any) =>
    new Promise((resolve, reject) => {
      store.set(key, value, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

  const getStoreValue = <T = any>(key: string) =>
    new Promise<T | null>((resolve, reject) => {
      store.get(key, (err, value) => {
        if (err) reject(err);
        else resolve((value as unknown) as T);
      });
    });

  const destroyStoreKey = (key: string) =>
    new Promise((resolve, reject) => {
      store.destroy(key, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

  router.post('/', async (req, res) => {
    const {
      body: { email },
    } = req;

    if (!email) {
      return res.status(400).json({ error: 'Bad request' });
    }

    const user = await Users.findByEmail(email);
    if (!user)
      return res.status(400).json({ error: 'Email is not registered' });

    const expires = new Date();
    expires.setHours(expires.getHours() + 3);

    const code = crypto
      .randomBytes(4)
      .toString('hex')
      .toUpperCase()
      .replace(/(.{4})(.{4})/, '$1-$2');

    await setStoreValue(code, { email, expires: expires.toUTCString() });
    await sendCode(email, code);
    return res.json({ sucess: true });
  });

  const authenticate = async (
    email: string,
    code: string
  ): Promise<boolean> => {
    const storeValue = await getStoreValue(code);

    if (
      storeValue &&
      email === storeValue.email &&
      Date.parse(storeValue.expires) >= Date.now()
    ) {
      return true;
    }

    return false;
  };

  router.get('/verify', async (req, res) => {
    const {
      query: { email, code },
    } = req;

    if (
      !email ||
      !code ||
      typeof email !== 'string' ||
      typeof code !== 'string'
    )
      return res.status(400).json({ error: 'Bad request' });

    if (await authenticate(email, code)) return res.json({ success: true });

    return res.status(401).json({ error: 'Invalid code' });
  });

  router.post('/reset', async (req, res) => {
    const {
      body: { email, code, password },
    } = req;

    const user = await Users.findByEmail(email);
    if (!user) return res.status(400).json({ error: 'Email not registered' });

    if (!email || !code || !password)
      return res.status(400).json({ error: 'Bad request' });

    if (await authenticate(email, code)) {
      const hash = await bcrypt.hash(password, 10);
      user.password = hash;
      await Users.update(user);

      await destroyStoreKey(code);

      return res.json({ success: true });
    }

    return res.status(401).json({ error: 'Invalid code' });
  });

  return router;
}
