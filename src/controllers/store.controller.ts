import { NextFunction, Request, Response } from 'express';
import { WEEK, WEEK_TYPE } from '../constants';
import { IOpeningHour } from '../interfaces/store.interface';
import { storeService } from '../services/store.service';
import { serverMessage, statusMessage } from '../utils/message.util';

class StoreController {
  async createOne(req: any, res: Response, next: NextFunction) {
    try {
      const storeDto = req.body;
      const files: Express.Multer.File[] = req.files;

      if (files.length > 0) {
        storeDto.url = files.map((file) => {
          return file.filename;
        });
      }

      if (storeDto.openingHour) {
        storeDto.openingHour = JSON.parse(storeDto.openingHour);
      }

      if (storeDto.breakTime) {
        storeDto.breakTime = JSON.parse(storeDto.breakTime);
      }

      if (storeDto.closedDay) {
        storeDto.closedDay = JSON.parse(storeDto.closedDay);
      }

      if (storeDto.dayOfWeekDay) {
        storeDto.dayOfWeekDay = JSON.parse(storeDto.dayOfWeekDay);
      }

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

      storeDto.userId = res.locals.user.id;
      const result = await storeService.createOne(storeDto);
      res.status(201).send({ body: result });
    } catch (e) {
      next(e);
    }
  }

  async updateOne(req: any, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const storeDto = req.body;

      const files: Express.Multer.File[] = req.files;

      if (files.length > 0) {
        storeDto.url = files.map((file) => {
          return file.filename;
        });
      }

      if (storeDto.openingHour) {
        storeDto.openingHour = JSON.parse(storeDto.openingHour);
      }

      if (storeDto.breakTime) {
        storeDto.breakTime = JSON.parse(storeDto.breakTime);
      }

      if (storeDto.closedDay) {
        storeDto.closedDay = JSON.parse(storeDto.closedDay);
      }

      if (storeDto.dayOfWeekDay) {
        storeDto.dayOfWeekDay = JSON.parse(storeDto.dayOfWeekDay);
      }

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

      storeDto.id = id;
      storeDto.userId = res.locals.user.id;
      const result = await storeService.deleteAndCreate(storeDto);

      res.status(201).send({ body: result });
    } catch (e) {
      next(e);
    }
  }

  async getAllStoreInformation(
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const result = await storeService.getAllStoreInformation(id);

      res.status(200).send({ body: result });
    } catch (e) {
      next(e);
    }
  }

  async getAllSimpleStoreInformation(
    req: Request<{}, {}, {}, { skip: number }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const skip = req.query.skip ?? 0;

      const result = await storeService.getAllSimpleStoreInformation(skip);

      res.status(200).send({ body: result });
    } catch (e) {
      next(e);
    }
  }

  async findByMonthOrToday(
    req: Request<
      { id: number },
      {},
      {},
      { month: number; search: string; skip: number }
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { month, search, skip } = req.query;

      if (!id) {
        const msg = `${statusMessage.BAD_REQUEST}+${serverMessage.E001}`;
        throw new Error(msg);
      }

      let result;

      if (month) {
        result = await storeService.findMonthlyReservationByStoreId({
          id,
          month,
        });
      } else if (skip) {
        result = await storeService.findAllUser({ id, skip });
      } else if (search) {
        const regex = new RegExp('^[0-9]+$');
        if (regex.test(search)) {
          result = await storeService.findUserByPhone({ id, phone: search });
        } else {
          result = await storeService.findUserByName({ id, name: search });
        }
      } else {
        result = await storeService.findTodayReservationByStoreId(id);
      }

      res.status(200).send({ body: result });
    } catch (e) {
      next(e);
    }
  }
}

export const storeController = new StoreController();
