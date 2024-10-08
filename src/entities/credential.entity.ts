import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserCredential } from './user-credential.entity';
import { Role } from './role.entity';

@Entity()
export class Credential {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Role, (role) => role.credential)
  @JoinColumn({ name: 'role_id', foreignKeyConstraintName: 'fk_credential_role' })
  role: Role;

  @Column('varchar', { length: 10 })
  type: string;

  @Column('varchar')
  password: string;

  @OneToMany(() => UserCredential, (userCredential) => userCredential.credential)
  userCredential: UserCredential;
}
