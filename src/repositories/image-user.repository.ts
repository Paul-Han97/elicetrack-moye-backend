import { AppDataSource } from '../db/datasource';
import { ImageUser } from '../entities/image-user.entity';
import { Store } from '../entities/store.entity';
import { User } from '../entities/user.entity';

const repository = AppDataSource.getRepository(ImageUser);

class ImageUserRepository {
  async findByUser(user: User) {
    return await repository
      .createQueryBuilder('A')
      .where('A.user_id = :userId', {
        userId: user.id,
      })
      .getMany();
  }
}

export const imageUserRepository = new ImageUserRepository();
