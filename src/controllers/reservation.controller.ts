import { NextFunction, Response } from 'express';
import { reservationService } from '../services/reservation.service';
import { serverMessage, statusMessage } from '../utils/message.util';

class ReservationController {
  async findByMonthOrToday(req: any, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;
      const { month, search, skip } = req.query;

      if (!storeId) {
        const msg = `${statusMessage.BAD_REQUEST}+${serverMessage.E001}`;
        throw new Error(msg);
      }

      let result;

      if(month) {
        result = await reservationService.findMonthlyReservationByStoreId({ storeId, month });
      }
      
      else if(skip) {
        result = await reservationService.findAllUser({ storeId, skip });
      }

      else if(search) {
        const regex = new RegExp('^[0-9]+$');
        if(regex.test(search)) {
          result = await reservationService.findUserByPhone({ storeId, phone: search });
        } else {
          result = await reservationService.findUserByName({ storeId, name: search });
        }
      }
      
      else {
        result = await reservationService.findTodayReservationByStoreId(storeId);
      }

      res.status(200).send({ body: result });
    } catch (e) {
      next(e);
    }
  }
}

export const reservationController = new ReservationController();
