import {
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { User } from './user.entity';
import { Credential } from './credential.entity';

@Entity()
export class UserCredential {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user) => user.userCredential)
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'fk_userCredential_user' })
  user: User;

  @ManyToOne(() => Credential, (credential) => credential.userCredential)
  @JoinColumn({ name: 'credential_id', foreignKeyConstraintName: 'fk_userCredential_credential' })
  credential: Credential;
}
