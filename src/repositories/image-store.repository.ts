import { AppDataSource } from '../db/datasource';
import { ImageStore } from '../entities/image-store.entity';
import { Store } from '../entities/store.entity';

const repository = AppDataSource.getRepository(ImageStore);

class ImageStoreRepository {
  async findByStore(store: Store) {
    return await repository
      .createQueryBuilder('A')
      .where('A.store_id = :storeId', {
        storeId: store.id,
      })
      .getMany();
  }
}

export const imageStoreRepository = new ImageStoreRepository();
