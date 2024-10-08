import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from './image.entity';
import { Store } from './store.entity';

@Entity()
export class ImageStore {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Image, (image) => image.imageStore)
  @JoinColumn({
    name: 'image_id',
    foreignKeyConstraintName: 'fk_imageStore_image',
  })
  image: Image;

  @ManyToOne(() => Store, (store) => store.imageStore)
  @JoinColumn({
    name: 'store_id',
    foreignKeyConstraintName: 'fk_imageStore_store',
  })
  store: Store;

  @Column('boolean', { name: 'is_primary' })
  isPrimary: boolean;
}
