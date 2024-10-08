import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Reservation } from './reservation.entity';
import { Store } from './store.entity';
import { UserCredential } from './user-credential.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar')
  email: string;

  @Column('varchar')
  name: string;

  @Column('varchar', {length: 20})
  phone: string;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservation: Reservation;

  @OneToMany(() => Store, (store) => store.user)
  store: Store;

  @OneToMany(() => UserCredential, (userCredential) => userCredential.user)
  userCredential: UserCredential;
}
