import { NextFunction, Request, Response } from 'express';
import { reservationService } from '../services/reservation.service';
import { serverMessage, statusMessage } from '../utils/message.util';
import { IRequest, IUpdateState } from '../interfaces/reservation.interface';
import { getTime, getYmd } from '../utils/date.util';

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
        const msg = `${statusMessage.BAD_REQUEST}+${serverMessage.E001}`;
        throw new Error(msg);
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
        const msg = `${statusMessage.BAD_REQUEST}+${serverMessage.E001}`;
        throw new Error(msg);
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
