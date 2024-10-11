import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ImageStore } from './image-store.entity';
import { Reservation } from './reservation.entity';
import { StoreDefaultOpeningHour } from './store-default-opening-hour.entity';
import { StoreOpeningHourOverride } from './store-opening-hour-override.entity';
import { User } from './user.entity';

@Entity()
export class Store {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user) => user.store)
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'fk_store_user' })
  user: User;

  @Column('varchar', { name: 'business_registeration_number', length: 13 })
  businessRegistrationNumber: string;

  @Column('varchar', { name: 'business_name' })
  businessName: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  address: string;

  @Column('varchar', { length: 20 })
  contact: string;

  @Column('int', { name: 'seat_count' })
  seatCount: number;

  @Column('int', { name: 'table_count' })
  tableCount: number;

  @OneToMany(() => ImageStore, (imageStore) => imageStore.store)
  imageStore: ImageStore;

  @OneToMany(() => Reservation, (reservation) => reservation.store)
  reservation: Reservation;

  @OneToMany(
    () => StoreDefaultOpeningHour,
    (storeDefaultOpeningHour) => storeDefaultOpeningHour.store
  )
  storeDefaultOpeningHour: StoreDefaultOpeningHour;

  @OneToMany(
    () => StoreOpeningHourOverride,
    (storeOpeningOverride) => storeOpeningOverride.store
  )
  storeOpeningHourOverride: StoreOpeningHourOverride;
}
