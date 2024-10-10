import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Credential } from './credential.entity';

@Entity()
export class CredentialType {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 10 })
  type: string;

  @OneToMany(() => Credential, (credential) => credential.credentialType)
  credential: Credential;
}
