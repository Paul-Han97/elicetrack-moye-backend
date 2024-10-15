import { AppDataSource } from '../db/datasource';
import { OpeningHour } from '../entities/opening-hour.entity';
import { StoreDefaultOpeningHour } from '../entities/store-default-opening-hour.entity';
import { StoreOpeningHourOverride } from '../entities/store-opening-hour-override.entity';
import { Store } from '../entities/store.entity';
import { ICreateOne } from '../interfaces/store.interface';
import { statusMessage, serverMessage } from '../utils/message.util';
import { storeQuery } from '../utils/sql-query.util';

const repository = AppDataSource.getRepository(Store);

class StoreRepository {
  async createOne(createOneDto: ICreateOne) {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const manager = queryRunner.manager;

    try {
      await manager.getRepository(Store).save(createOneDto.store);

      for (let i = 0; i < createOneDto.storeOpeningHourOverride.length; i++) {
        await manager
          .getRepository(StoreOpeningHourOverride)
          .save(createOneDto.storeOpeningHourOverride[i]);
      }

      for (let i = 0; i < createOneDto.storeDefaultOpeningHour.length; i++) {
        await manager
          .getRepository(StoreDefaultOpeningHour)
          .save(createOneDto.storeDefaultOpeningHour[i]);
      }

      for (let i = 0; i < createOneDto.openingHour.length; i++) {
        await manager
          .getRepository(OpeningHour)
          .save(createOneDto.openingHour[i]);
      }

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      const msg = `${statusMessage.INTERNAL_SERVER_ERROR}+${serverMessage.E005}`;
      throw new Error(msg);
    } finally {
      await queryRunner.release();
    }

    return serverMessage.S002;
  }

  async findTodayOpeningHourById(id: number) {
    const sql = storeQuery.findTodayOpeningHourById;
    return await repository.query(sql, [id]);
  }

  async findById(id: number) {
    const sql = storeQuery.findById;
    return await repository.query(sql, [id]);
  }

  async findOpeningHourById(id: number) {
    const sql = storeQuery.findOpeningHourById;
    return await repository.query(sql, [id]);
  }

  async findClosedDayById(id: number) {
    const sql = storeQuery.findClosedDayById;
    return await repository.query(sql, [id]);
  }

  async findRegularHolidayById(id: number) {
    const sql = storeQuery.findRegularHolidayById;
    return await repository.query(sql, [id]);
  }

  async findImageById(id: number) {
    const sql = storeQuery.findImageById;
    return await repository.query(sql, [id]);
  }
}

export const storeRepository = new StoreRepository();
