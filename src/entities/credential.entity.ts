import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Common } from './common.abstract';
import { CredentialType } from './credential-type.entity';
import { Role } from './role.entity';
import { UserCredential } from './user-credential.entity';

@Entity()
export class Credential extends Common {
  @ManyToOne(() => Role, (role) => role.credential)
  @JoinColumn({
    name: 'role_id',
    foreignKeyConstraintName: 'fk_credential_role',
  })
  role: Role;

  @ManyToOne(
    () => CredentialType,
    (credentialType) => credentialType.credential
  )
  @JoinColumn({
    name: 'credential_type_id',
    foreignKeyConstraintName: 'fk_credential_credentialType',
  })
  credentialType: CredentialType;

  @Column('varchar')
  password: string;

  @OneToMany(
    () => UserCredential,
    (userCredential) => userCredential.credential
  )
  userCredential: UserCredential;
}
