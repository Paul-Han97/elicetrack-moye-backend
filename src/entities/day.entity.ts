import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StoreDefaultOpeningHour } from './store-default-opening-hour.entity';

@Entity()
export class Day {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 3 })
  type: string;

  @OneToMany(() => StoreDefaultOpeningHour, (storeDefaultOpeningHour) => storeDefaultOpeningHour.day)
  storeDefaultOpeningHour: StoreDefaultOpeningHour;
}
