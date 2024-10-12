import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Common } from './common.abstract';
import { Credential } from './credential.entity';
import { User } from './user.entity';

@Entity()
export class UserCredential extends Common {
  @ManyToOne(() => User, (user) => user.userCredential)
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_userCredential_user',
  })
  user: User;

  @ManyToOne(() => Credential, (credential) => credential.userCredential)
  @JoinColumn({
    name: 'credential_id',
    foreignKeyConstraintName: 'fk_userCredential_credential',
  })
  credential: Credential;
}
