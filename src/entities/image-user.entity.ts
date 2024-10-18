import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Common } from './common.abstract';
import { Image } from './image.entity';
import { User } from './user.entity';

@Entity()
export class ImageUser extends Common {
  @ManyToOne(() => Image, (image) => image.imageUser)
  @JoinColumn({
    name: 'image_id',
    foreignKeyConstraintName: 'fk_imageUser_image',
  })
  image: Image;

  @ManyToOne(() => User, (user) => user.imageUser)
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_imageUser_user',
  })
  user: User;

  @Column('boolean', { name: 'is_primary', default: false })
  isPrimary: boolean;
}
