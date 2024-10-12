import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Common } from './common.abstract';
import { ImageStore } from './image-store.entity';

@Entity()
export class Image extends Common {
  @Column('varchar')
  src: string;

  @OneToMany(() => ImageStore, (imageStore) => imageStore.image)
  imageStore: ImageStore;
}
