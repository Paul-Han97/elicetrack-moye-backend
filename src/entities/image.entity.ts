import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ImageStore } from './image-store.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar')
  src: string;

  @OneToMany(() => ImageStore, (imageStore) => imageStore.image)
  imageStore: ImageStore;
}
