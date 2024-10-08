import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReservationState } from './reservation-state.entity';
import { Store } from './store.entity';
import { User } from './user.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user) => user.reservation)
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_reservation_user',
  })
  user: User;

  @ManyToOne(() => Store, (store) => store.reservation)
  @JoinColumn({
    name: 'store_id',
    foreignKeyConstraintName: 'fk_reservation_store',
  })
  store: Store;

  @ManyToOne(
    () => ReservationState,
    (reservationState) => reservationState.reservation
  )
  @JoinColumn({
    name: 'reservation_state_id',
    foreignKeyConstraintName: 'fk_reservation_reservationState',
  })
  reservationState: ReservationState;

  @Column('varchar')
  description: string;

  @Column('time')
  time: Date;
}
