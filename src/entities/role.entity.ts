import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Credential } from './credential.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 12 })
  type: string;

  @OneToMany(() => Credential, (credential) => credential.role)
  credential: Credential;
}
