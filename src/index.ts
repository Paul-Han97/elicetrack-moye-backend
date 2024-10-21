import cookieParser from 'cookie-parser';
import express from 'express';
import { config } from './config';
import { dbConnect } from './db/datasource';
import { auth } from './middlewares/auth.middleware';
import { errorHandler } from './middlewares/error.middleware';
import { mainRouter } from './routers/main.router';
import { reservationRouter } from './routers/reservation.router';
import { storeRouter } from './routers/store.router';
import { userRouter } from './routers/user.router';

const PORT = config.server.port;
const BASE_URL = config.baseUrl;

const app = express();

dbConnect();

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(`${BASE_URL}/static`, auth, express.static('private'));

app.use(`${BASE_URL}`, mainRouter);
app.use(`${BASE_URL}/users`, userRouter);
app.use(`${BASE_URL}/stores`, auth, storeRouter);
app.use(`${BASE_URL}/reservations`, auth, reservationRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 에서 정상적으로 실행 되었습니다.`);
});
