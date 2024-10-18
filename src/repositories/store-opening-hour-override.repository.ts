import { AppDataSource } from '../db/datasource';
import { StoreOpeningHourOverride } from '../entities/store-opening-hour-override.entity';
import { Store } from '../entities/store.entity';

const repository = AppDataSource.getRepository(StoreOpeningHourOverride);

class StoreOpeningHourOverrideRepository {
  async findByStore(store: Store) {
    return await repository
      .createQueryBuilder('A')
      .where('A.store_id = :storeId', { storeId: store.id })
      .getMany();
  }
}

export const storeOpeningHourOverrideRepository =
  new StoreOpeningHourOverrideRepository();
