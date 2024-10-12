import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Common } from './common.abstract';
import { Day } from './day.entity';
import { OpeningHour } from './opening-hour.entity';
import { Store } from './store.entity';

@Entity()
export class StoreDefaultOpeningHour extends Common {
  @ManyToOne(() => Store, (store) => store.storeDefaultOpeningHour)
  @JoinColumn({
    name: 'store_id',
    foreignKeyConstraintName: 'fk_storeDefaultOpeningHour_store',
  })
  store: Store;

  @ManyToOne(() => Day, (day) => day.storeDefaultOpeningHour)
  @JoinColumn({
    name: 'day_id',
    foreignKeyConstraintName: 'fk_storeDefaultOpeningHour_day',
  })
  day: Day;

  @OneToMany(
    () => OpeningHour,
    (openingHour) => openingHour.storeDefaultOpeningHour
  )
  openingHour: OpeningHour;
}
