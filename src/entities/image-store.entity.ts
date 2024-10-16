import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Common } from './common.abstract';
import { Image } from './image.entity';
import { Store } from './store.entity';

@Entity()
export class ImageStore extends Common {
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

  @Column('boolean', { name: 'is_primary', default: false })
  isPrimary: boolean;
}
