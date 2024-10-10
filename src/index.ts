import 'dotenv/config';
import cors from 'cors';
import config from './config';
import express from 'express';
import { errorHandler } from './middlewares/error.middleware';
import { userRouter } from './routers/user.router';

const PORT = config.server.port;
const app = express();

app.use(
  cors({
    origin: '*',
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/users', userRouter);

app.use(errorHandler);

app.listen(PORT);
