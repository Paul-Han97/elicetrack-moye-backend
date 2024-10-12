import { Column, Entity, OneToMany } from 'typeorm';
import { Common } from './common.abstract';
import { StoreDefaultOpeningHour } from './store-default-opening-hour.entity';

@Entity()
export class Day extends Common {
  @Column('varchar', { length: 3 })
  type: string;

  @OneToMany(
    () => StoreDefaultOpeningHour,
    (storeDefaultOpeningHour) => storeDefaultOpeningHour.day
  )
  storeDefaultOpeningHour: StoreDefaultOpeningHour;
}
