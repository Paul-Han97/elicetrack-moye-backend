import { STATIC_PATH, URL_SEP } from '../constants';
import { ImageStore } from '../entities/image-store.entity';
import { Image } from '../entities/image.entity';
import { Store } from '../entities/store.entity';
import { ICreateOne, IImage } from '../interfaces/image.interface';
import { imageRepository } from '../repositories/image.repository';
import path from 'path'
class ImageService {
  async createOne({ userId, storeId, filenames }: IImage) {
    const createOneDto: ICreateOne = {
      image: [],
      imageStore: [],
    };

    for (const filename of filenames) {
      const image = new Image();
      image.url = STATIC_PATH + URL_SEP + storeId.toString() + URL_SEP + filename;
      image.registeredUser = userId;
      image.updatedUser = userId;

      const store = new Store();
      store.id = storeId;

      const imageStore = new ImageStore();
      imageStore.store = store;
      imageStore.image = image;
      imageStore.registeredUser = userId;
      imageStore.updatedUser = userId;

      createOneDto.image.push(image);
      createOneDto.imageStore.push(imageStore);
    }

    return await imageRepository.createOne(createOneDto);
  }
}

export const imageService = new ImageService();
