import { Column, Entity, OneToMany } from 'typeorm';
import { Common } from './common.abstract';
import { Reservation } from './reservation.entity';

@Entity()
export class ReservationState extends Common {
  @Column('varchar', { length: 7 })
  type: string;

  @OneToMany(() => Reservation, (reservation) => reservation.reservationState)
  reservation: Reservation;
}
