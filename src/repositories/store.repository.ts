import { STATIC_PATH, URL_SEP } from '../constants';
import { AppDataSource } from '../db/datasource';
import { ImageStore } from '../entities/image-store.entity';
import { Image } from '../entities/image.entity';
import { OpeningHour } from '../entities/opening-hour.entity';
import { StoreDefaultOpeningHour } from '../entities/store-default-opening-hour.entity';
import { StoreOpeningHourOverride } from '../entities/store-opening-hour-override.entity';
import { Store } from '../entities/store.entity';
import { ICreateOne, IDeleteOne } from '../interfaces/store.interface';
import { fileUtil } from '../utils/file.util';
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

      for (let i = 0; i < createOneDto.image.length; i++) {
        await manager.getRepository(Image).save(createOneDto.image[i]);
      }

      for (let i = 0; i < createOneDto.imageStore.length; i++) {
        await manager
          .getRepository(ImageStore)
          .save(createOneDto.imageStore[i]);
      }

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

    const result = {
      message: serverMessage.S002,
    };

    return result;
  }

  async deleteAndCreate({
    createOneDto,
    deleteOneDto,
  }: {
    createOneDto: ICreateOne;
    deleteOneDto: IDeleteOne;
  }) {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const manager = queryRunner.manager;

    try {
      await manager.getRepository(Store).save(createOneDto.store);

      for (let i = 0; i < deleteOneDto.imageStore.length; i++) {
        await manager
          .getRepository(ImageStore)
          .delete({ id: deleteOneDto.imageStore[i].id });
      }

      for (let i = 0; i < deleteOneDto.image.length; i++) {
        const separator = STATIC_PATH + URL_SEP;
        const url = deleteOneDto.image[i].url.split(separator)[1];
        const dir = fileUtil.join(fileUtil.cwd, url);
        fileUtil.remove(dir);
        await manager
          .getRepository(Image)
          .delete({ id: deleteOneDto.image[i].id });
      }

      for (let i = 0; i < deleteOneDto.storeOpeningHourOverride.length; i++) {
        await manager
          .getRepository(StoreOpeningHourOverride)
          .delete({ id: deleteOneDto.storeOpeningHourOverride[i].id });
      }

      for (let i = 0; i < deleteOneDto.openingHour.length; i++) {
        await manager
          .getRepository(OpeningHour)
          .delete({ id: deleteOneDto.openingHour[i].id });
      }

      for (let i = 0; i < createOneDto.image.length; i++) {
        await manager.getRepository(Image).save(createOneDto.image);
      }

      for (let i = 0; i < createOneDto.imageStore.length; i++) {
        await manager.getRepository(ImageStore).save(createOneDto.imageStore);
      }

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

    return serverMessage.S003;
  }

  async findById(id: number) {
    return await repository.findOneBy({ id });
  }

  async findTodayOpeningHourById(id: number) {
    const sql = storeQuery.findTodayOpeningHourById;
    return await repository.query(sql, [id]);
  }

  async findByIdWithEmail(id: number) {
    const sql = storeQuery.findByIdWithEmail;
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

  async findFormattedImageById(id: number) {
    const sql = storeQuery.findFormattedImageById;
    return await repository.query(sql, [id]);
  }

  async findImageById(id: number): Promise<Image[]> {
    const sql = storeQuery.findImageById;
    return await repository.query(sql, [id]);
  }
}

export const storeRepository = new StoreRepository();
