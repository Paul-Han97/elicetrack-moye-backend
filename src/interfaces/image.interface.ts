import { ImageStore } from "../entities/image-store.entity";
import { Image } from "../entities/image.entity";

export interface IImage {
    userId: number;
    storeId: number;
    filenames: string[];
}

export interface ICreateOne {
    image: Image[];
    imageStore: ImageStore[];
}