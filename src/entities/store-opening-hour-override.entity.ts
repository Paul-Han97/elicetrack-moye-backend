import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Common } from './common.abstract';
import { Store } from './store.entity';

@Entity()
export class StoreOpeningHourOverride extends Common {
  @ManyToOne(() => Store, (store) => store.storeOpeningHourOverride)
  @JoinColumn({
    name: 'store_id',
    foreignKeyConstraintName: 'fk_storeOpeningHourOverride_store',
  })
  store: Store;

  @Column('boolean', { name: 'is_closed' })
  isClosed: boolean;

  @Column('datetime', { name: 'open_from', nullable: true })
  openFrom: Date;

  @Column('datetime', { name: 'close_to', nullable: true })
  closeTo: Date;
}
