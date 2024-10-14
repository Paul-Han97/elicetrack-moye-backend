import { NextFunction, Response } from 'express';
import { IOpeningHour, IStore } from '../interfaces/store.interface';
import { WEEK, WEEK_TYPE } from '../constants';
import { storeService } from '../services/store.service';
import { statusMessage, serverMessage } from '../utils/message.util';

class StoreController {
  async createOne(req: any, res: Response, next: NextFunction) {
    try {
      const storeDto = req.body;
      const openingHour: IOpeningHour[] = [];
      const afterOpeningHour: IOpeningHour[] = [];

      const typeAsc = (a: any, b: any) => {
        return a.type > b.type ? -1 : 1;
      };

      storeDto.openingHour.sort(typeAsc);

      for (let i = WEEK_TYPE.SUN; i <= WEEK; i++) {
        const isWeekdays = i !== WEEK_TYPE.SUN && i !== WEEK_TYPE.SAT;
        const index = isWeekdays ? 0 : 1;

        const data: IOpeningHour = {
          openFrom: storeDto.openingHour[index].openFrom,
          closeTo: storeDto.openingHour[index].closeTo,
        };

        if (storeDto.breakTime) {
          storeDto.breakTime.sort(typeAsc);
          const afterBreak: IOpeningHour = {
            openFrom: storeDto.breakTime[index].closeTo,
            closeTo: data.closeTo,
          };

          data.closeTo = storeDto.breakTime[index].openFrom;

          afterOpeningHour.push(afterBreak);
        }

        openingHour.push(data);
      }

      storeDto.openingHour = openingHour;
      storeDto.afterBreakTime = afterOpeningHour;

      storeDto.userId = req.user.id;
      const result = await storeService.createOne(storeDto);

      res.status(201).send({ body: result });
    } catch (e) {
      next(e);
    }
  }

  async findByMonthOrToday(req: any, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { month, search, skip } = req.query;

      if (!id) {
        const msg = `${statusMessage.BAD_REQUEST}+${serverMessage.E001}`;
        throw new Error(msg);
      }

      let result;

      if(month) {
        result = await storeService.findMonthlyReservationByStoreId({ id, month });
      }
      
      else if(skip) {
        result = await storeService.findAllUser({ id, skip });
      }

      else if(search) {
        const regex = new RegExp('^[0-9]+$');
        if(regex.test(search)) {
          result = await storeService.findUserByPhone({ id, phone: search });
        } else {
          result = await storeService.findUserByName({ id, name: search });
        }
      }
      
      else {
        result = await storeService.findTodayReservationByStoreId(id);
      }

      res.status(200).send({ body: result });
    } catch (e) {
      next(e);
    }
  }
}

export const storeController = new StoreController();
