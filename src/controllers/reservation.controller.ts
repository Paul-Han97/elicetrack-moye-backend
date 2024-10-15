import { NextFunction, Request, Response } from 'express';
import { reservationService } from '../services/reservation.service';
import { serverMessage, statusMessage } from '../utils/message.util';
import { IUpdateOneDTo } from '../interfaces/reservation.interface';

class ReservationController {
  async createOne(
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

      const updateOneDto:IUpdateOneDTo = {
        id,
        userId,
        state
      }

      const result = await reservationService.updateOne(updateOneDto);

      res.status(201).send({ body: result });
    } catch (e) {
      next(e);
    }
  }
}

export const reservationController = new ReservationController();
