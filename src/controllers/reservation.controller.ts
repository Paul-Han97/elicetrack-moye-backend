import { NextFunction, Request, Response } from 'express';
import { reservationService } from '../services/reservation.service';
import { serverMessage, errorName } from '../utils/message.util';
import { IRequest, IUpdateState } from '../interfaces/reservation.interface';
import { getTime, getYmd } from '../utils/date.util';
import { AppError } from '../middlewares/error.middleware';

class ReservationController {
  async updateState(
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { state } = req.body;
      const userId = res.locals.user.id;

      if (!id) {
        throw new AppError(errorName.BAD_REQUEST, serverMessage.E001, true);
      }

      const updateStateDto: IUpdateState = {
        id,
        userId,
        state,
      };

      const result = await reservationService.updateState(updateStateDto);

      res.status(201).send({ body: result });
    } catch (e) {
      next(e);
    }
  }

  async createOne(
    req: Request<{}, {}, IRequest, {}>,
    res: Response<
      {},
      { user: { id: number; role: string } }
    >,
    next: NextFunction
  ) {
    try {
      const { storeId, description, count, startTime, endTime } = req.body;
      const userId = res.locals.user.id;

      const timeRegExp = /^[0-9]{2}:[0-9]{2}$/;

      if(!timeRegExp.test(startTime) || !timeRegExp.test(endTime)) {
        throw new AppError(errorName.BAD_REQUEST, serverMessage.E001, true);
      }

      const requestDto:IRequest = {
        storeId,
        userId,
        description: description ?? '',
        count,
        startTime,
        endTime
      }

      const result = await reservationService.createOne(requestDto);

      res.status(201).send({ body: result });
    } catch (e) {
      next(e);
    }
  }
}

export const reservationController = new ReservationController();
