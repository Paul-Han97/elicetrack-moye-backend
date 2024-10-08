import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StoreDefaultOpeningHour } from './store-default-opening-hour.entity';

@Entity()
export class OpeningHour {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(
    () => StoreDefaultOpeningHour,
    (storeDefaultOpeningHour) => storeDefaultOpeningHour.openingHour
  )
  @JoinColumn({
    name: 'store_default_opening_hour_id',
    foreignKeyConstraintName: 'fk_openingHour_storeDefaultOpeningHour',
  })
  storeDefaultOpeningHour: StoreDefaultOpeningHour;

  @Column('time', { name: 'open_from' })
  openFrom: Date;

  @Column('time', { name: 'close_to' })
  closeTo: Date;
}
