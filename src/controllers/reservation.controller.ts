import { NextFunction, Response } from 'express';
import { reservationService } from '../services/reservation.service';
import { serverMessage, statusMessage } from '../utils/message.util';

class ReservationController {
  async findReservationByMonthOrToday(req: any, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;
      const { month } = req.query;

      if (!storeId) {
        const msg = `${statusMessage.BAD_REQUEST}+${serverMessage.E001}`;
        throw new Error(msg);
      }

      let result;

      if(month) {
        result = await reservationService.findMonthlyReservationByStoreId({ storeId, month });
      } else {
        result = await reservationService.findTodayReservationByStoreId(storeId);
      }

      res.status(200).send({ body: result });
    } catch (e) {
      next(e);
    }
  }
}

export const reservationController = new ReservationController();
