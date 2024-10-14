import { NextFunction, Response } from 'express';
import { IOpeningHour, IStore } from '../interfaces/store.interface';
import { WEEK, WEEK_TYPE } from '../constants';
import { storeService } from '../services/store.service';

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
}

export const storeController = new StoreController();
