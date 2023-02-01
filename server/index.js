import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import https from 'https';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
dotenv.config();

import { initSession, getParam, getBet, getBalance } from './controllers/index.js';
import { ENDPOINTS } from './consts/endpoints.js';

// const __dirname = path.resolve();
export const PORT = process.env.PORT;
export const DOMAIN = process.env.PORT.DOMAIN + ':' + PORT;
export const PATH_TO_GAME = 'http://localhost:8080';
const app = express();

mongoose.set('strictQuery', false); // иначе в консоли ругается
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

app.use(express.json());
app.use(
  cors({
    origin: '*',
  }),
);

app.post(ENDPOINTS.init_url, initSession);

app.get(ENDPOINTS.param_url, getParam);

app.post(ENDPOINTS.bet_url, getBet);

app.post(ENDPOINTS.balance_url, getBalance);

https
  .createServer(
    {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem'),
    },
    app,
  )
  .listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}`);
  });
