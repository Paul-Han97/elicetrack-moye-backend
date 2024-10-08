import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Store } from './store.entity';

@Entity()
export class StoreOpeningHourOverride {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Store, (store) => store.storeOpeningHourOverride)
  @JoinColumn({
    name: 'store_id',
    foreignKeyConstraintName: 'fk_storeOpeningHourOverride_store',
  })
  store: Store;

  @Column('boolean', { name: 'is_closed' })
  isClosed: boolean;

  @Column('datetime', { name: 'open_from' })
  openFrom: Date;

  @Column('datetime', { name: 'close_to' })
  closeTo: Date;
}
