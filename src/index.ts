import cors from 'cors';
import express from 'express';
import config from './config';
import { dbConnect } from './db/datasource';
import { auth } from './middlewares/auth.middleware';
import { errorHandler } from './middlewares/error.middleware';
import { mainRouter } from './routers/main.router';
import { reservationRouter } from './routers/reservation.router';
import { storeRouter } from './routers/store.router';
import { userRouter } from './routers/user.router';

const PORT = config.server.port;
const app = express();

app.use(
  cors({
    origin: '*',
  })
);

dbConnect();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/static', auth, express.static('private'));

app.use('/', mainRouter);
app.use('/users', userRouter);
app.use('/stores', auth, storeRouter);
app.use('/reservations', auth, reservationRouter);

app.use(errorHandler);

app.listen(PORT);
