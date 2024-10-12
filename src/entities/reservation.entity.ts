import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Common } from './common.abstract';
import { ReservationState } from './reservation-state.entity';
import { Store } from './store.entity';
import { User } from './user.entity';

@Entity()
export class Reservation extends Common {
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

  @Column('datetime', { name: 'start_time' })
  startTime: Date;

  @Column('datetime', { name: 'end_time' })
  endTime: Date;
}
