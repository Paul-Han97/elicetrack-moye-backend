import cors from 'cors';
import config from './config';
import express from 'express';
import { errorHandler } from './middlewares/error.middleware';
import { userRouter } from './routers/user.router';
import { mainRouter } from './routers/main.router';
import { auth } from './middlewares/auth.middleware';
import { storeRouter } from './routers/store.router';
import { AppDataSource } from './db/datasource';

const PORT = config.server.port;
const app = express();

app.use(
  cors({
    origin: '*',
  })
);

AppDataSource.initialize()
  .then(() => {
    console.log('AppDataSource 초기화 성공');
  })
  .catch((e) => {
    console.error(`AppDataSource 초기화 중 오류: ${e}`);
  });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/static', auth, express.static('private'));

app.use('/', mainRouter);
app.use('/users', userRouter);
app.use('/stores', auth, storeRouter);

app.use(errorHandler);

app.listen(PORT);
