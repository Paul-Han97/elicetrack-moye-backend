import { NextFunction, Response } from 'express';
import { reservationService } from '../services/reservation.service';
import { serverMessage, statusMessage } from '../utils/message.util';

class ReservationController {
  async findByStoreIdGroupByDate(req: any, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;
      const { month } = req.query;

      if (!storeId || !month) {
        const msg = `${statusMessage.BAD_REQUEST}+${serverMessage.E001}`;
        throw new Error(msg);
      }

      const result = await reservationService.findByStoreIdGroupByDate({ storeId, month });

      res.status(200).send({ body: result });
    } catch (e) {
      next(e);
    }
  }
}

export const reservationController = new ReservationController();
