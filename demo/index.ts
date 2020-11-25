import { promises as fs } from 'fs';
import https from 'https';
import path from 'path';
import app from './app';

const { PORT } = process.env;

Promise.all([
  fs.readFile(path.resolve(__dirname, 'keys', 'localhost.key')),
  fs.readFile(path.resolve(__dirname, 'keys', 'localhost.crt')),
]).then(([keyBuffer, crtBuffer]) => {
  https
    .createServer(
      {
        key: keyBuffer.toString(),
        cert: crtBuffer.toString(),
      },
      app
    )
    .listen(PORT, () => console.log(`App listening on port ${PORT}`));
});
