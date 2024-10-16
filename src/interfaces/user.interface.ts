import { Credential } from '../entities/credential.entity';
import { UserCredential } from '../entities/user-credential.entity';
import { User } from '../entities/user.entity';

export interface IUser {
  email: string;
  name: string;
  phone: string;
  password: string;
  type: string;
}

export interface ISignup {
  user: User;
  credential: Credential;
  userCredential: UserCredential;
}
