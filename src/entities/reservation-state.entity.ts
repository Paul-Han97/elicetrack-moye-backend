import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Reservation } from './reservation.entity';

@Entity()
export class ReservationState {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 7 })
  type: string;

  @OneToMany(() => Reservation, (reservation) => reservation.reservationState)
  reservation: Reservation;
}
