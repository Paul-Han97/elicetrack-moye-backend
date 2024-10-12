import { Column, Entity, OneToMany } from 'typeorm';
import { Common } from './common.abstract';
import { Credential } from './credential.entity';

@Entity()
export class CredentialType extends Common {
  @Column('varchar', { length: 10 })
  type: string;

  @OneToMany(() => Credential, (credential) => credential.credentialType)
  credential: Credential;
}
