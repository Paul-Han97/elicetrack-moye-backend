import { AppDataSource } from '../db/datasource';
import { ImageStore } from '../entities/image-store.entity';
import { Image } from '../entities/image.entity';
import { ICreateOne } from '../interfaces/image.interface';
import { serverMessage, statusMessage } from '../utils/message.util';

const repository = AppDataSource.getRepository(Image);

class ImageRepository {
  async createOne(createOneDto: ICreateOne) {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const manager = queryRunner.manager;

    try {
      for (let i = 0; i < createOneDto.image.length; i++) {
        await manager.getRepository(Image).save(createOneDto.image[i]);
      }

      for (let i = 0; i < createOneDto.imageStore.length; i++) {
        await manager.getRepository(ImageStore).save(createOneDto.imageStore[i]);
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

}

export const imageRepository = new ImageRepository();
