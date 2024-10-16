import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Common } from './common.abstract';
import { Credential } from './credential.entity';

@Entity()
export class Role extends Common {
  @Column('varchar', { length: 12 })
  type: string;

  @OneToMany(() => Credential, (credential) => credential.role)
  credential: Credential;
}
