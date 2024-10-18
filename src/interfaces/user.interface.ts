import { Credential } from '../entities/credential.entity';
import { ImageUser } from '../entities/image-user.entity';
import { Image } from '../entities/image.entity';
import { UserCredential } from '../entities/user-credential.entity';
import { User } from '../entities/user.entity';

export interface IUser {
  id: number;
  email: string;
  name: string;
  phone: string;
  password: string;
  type: string;
  imageUrl: string;
}

export interface ISignup {
  user: User;
  credential: Credential;
  userCredential: UserCredential;
}

export interface ICreateOne {
  user: User;
  image: Image;
  imageUser: ImageUser;
}

export interface IDeleteOne {
  user: User;
  image: Image;
  imageUser: ImageUser;
}