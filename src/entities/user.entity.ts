import { Column, Entity, OneToMany } from 'typeorm';
import { Common } from './common.abstract';
import { Reservation } from './reservation.entity';
import { Store } from './store.entity';
import { UserCredential } from './user-credential.entity';
import { ImageUser } from './image-user.entity';

@Entity()
export class User extends Common {
  @Column('varchar')
  email: string;

  @Column('varchar')
  name: string;

  @Column('varchar', { length: 20 })
  phone: string;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservation: Reservation;

  @OneToMany(() => Store, (store) => store.user)
  store: Store;

  @OneToMany(() => UserCredential, (userCredential) => userCredential.user)
  userCredential: UserCredential;

  @OneToMany(() => ImageUser, (imageUser) => imageUser.user)
  imageUser: ImageUser;
}
