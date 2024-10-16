import { AppDataSource } from '../db/datasource';
import { OpeningHour } from '../entities/opening-hour.entity';
import { StoreDefaultOpeningHour } from '../entities/store-default-opening-hour.entity';

const repository = AppDataSource.getRepository(OpeningHour);

class OpeningHourRepository {
  async findByStoreDefaultOpeningHour(
    storeDefaultOpeningHour: StoreDefaultOpeningHour
  ) {
    return await repository
      .createQueryBuilder('A')
      .where('A.store_default_opening_hour_id = :storeDefaultOpeningHourId', {
        storeDefaultOpeningHourId: storeDefaultOpeningHour.id,
      })
      .getOne();
  }
}

export const openingHourRepository = new OpeningHourRepository();
