import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Common } from './common.abstract';
import { StoreDefaultOpeningHour } from './store-default-opening-hour.entity';

@Entity()
export class OpeningHour extends Common {
  @ManyToOne(
    () => StoreDefaultOpeningHour,
    (storeDefaultOpeningHour) => storeDefaultOpeningHour.openingHour
  )
  @JoinColumn({
    name: 'store_default_opening_hour_id',
    foreignKeyConstraintName: 'fk_openingHour_storeDefaultOpeningHour',
  })
  storeDefaultOpeningHour: StoreDefaultOpeningHour;

  @Column('time', { name: 'open_from', nullable: true })
  openFrom: Date;

  @Column('time', { name: 'close_to', nullable: true })
  closeTo: Date;
}
