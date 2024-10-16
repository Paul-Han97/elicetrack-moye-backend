import { AppDataSource } from '../db/datasource';
import { StoreDefaultOpeningHour } from '../entities/store-default-opening-hour.entity';
import { Store } from '../entities/store.entity';

const repository = AppDataSource.getRepository(StoreDefaultOpeningHour);

class StoreDefaultOpeningHourRepository {
  async findByStore(store: Store) {
    return await repository
      .createQueryBuilder('A')
      .where('A.store_id = :storeId', { storeId: store.id })
      .orderBy('A.id')
      .getMany();
  }
}

export const storeDefaultOpeningHourRepository = new StoreDefaultOpeningHourRepository();
