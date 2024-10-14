import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class Common {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', {
    name: 'register_user',
    default: 'ROLE_ADMIN',
  })
  registeredUser: string | number;

  @CreateDateColumn({ type: 'datetime', name: 'register_date' })
  registeredDate: Date;

  @Column('varchar', {
    name: 'update_user',
    default: 'ROLE_ADMIN',
  })
  updatedUser: string | number;

  @UpdateDateColumn({ type: 'datetime', name: 'update_date' })
  updatedDate: Date;
}
