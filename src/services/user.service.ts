import { CREDENTIAL_TYPE, ROLE_TYPE, STATIC_PATH, STORE_PATH, URL_SEP, USER_PATH } from '../constants';
import { CredentialType } from '../entities/credential-type.entity';
import { Credential } from '../entities/credential.entity';
import { ImageUser } from '../entities/image-user.entity';
import { Image } from '../entities/image.entity';
import { Role } from '../entities/role.entity';
import { UserCredential } from '../entities/user-credential.entity';
import { User } from '../entities/user.entity';
import { IGenerate } from '../interfaces/token.interface';
import {
  ICreateOne,
  IDeleteOne,
  ISignup,
  IUser,
} from '../interfaces/user.interface';
import { imageUserRepository } from '../repositories/image-user.repository';
import { userRepository } from '../repositories/user.repository';
import { Encrypt } from '../utils/encrypt.util';
import { serverMessage, statusMessage } from '../utils/message.util';
import { Token } from '../utils/token.util';

class UserService {
  async findByEmail(email: string) {
    return await userRepository.findByEmail(email);
  }

  async findByIdWithRole(id: number) {

    const user = await userRepository.findByIdWithRole(id);

    const result = {
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.userCredential.credential.role.type,
      imageUrl: user.imageUser?.image.url,
      stores: user.store,
      reservations: user.reservation,
    };

    return result;
  }

  async loadUserByEmail(email: string, password: string) {
    const user = await userRepository.loadUserByEmail(email);

    const isMatches = Encrypt.matches(password, user.password);

    if (!isMatches) {
      const msg = `${statusMessage.NOT_FOUND}+${serverMessage.E004}`;
      throw new Error(msg);
    }

    const payload: IGenerate = {
      type: Token.ACCESS,
      id: user.id,
      role: user.role,
    };

    const access = Token.generate(payload);

    payload.type = Token.REFRESH;

    const refresh = Token.generate(payload);

    const result = {
      access,
      refresh,
    };

    return result;
  }

  async signup({ email, name, phone, password }: IUser) {
    const hasUser = await userRepository.findByEmail(email);

    if (hasUser) {
      const msg = `${statusMessage.BAD_REQUEST}+${serverMessage.E006}`;
      throw new Error(msg);
    }

    const user = new User();
    user.email = email;
    user.name = name;
    user.phone = phone;

    const credentialType = new CredentialType();
    credentialType.id = CREDENTIAL_TYPE.LOCAL_ID;

    const role = new Role();
    role.id = ROLE_TYPE.MANAGER_ID;

    const credential = new Credential();
    credential.password = Encrypt.encode(password);
    credential.credentialType = credentialType;
    credential.role = role;

    const userCredential = new UserCredential();
    userCredential.user = user;
    userCredential.credential = credential;

    const signupDto: ISignup = {
      user,
      credential,
      userCredential,
    };

    const result = userRepository.signup(signupDto);

    return result;
  }

  async deleteAndInsertImage(userDto: IUser) {
    const user = await userRepository.findById(userDto.id);

    if (!user) {
      const msg = `${statusMessage.NOT_FOUND}+${serverMessage.E003}`;
      throw new Error(msg);
    }

    const createOneDto = <ICreateOne>{};
    const deleteOneDto = <IDeleteOne>{};

    const imageUser: ImageUser[] = await imageUserRepository.findByUser(user);
    const image: Image[] = await userRepository.findImageById(user.id);

    for(let i = 0; i < imageUser.length; i++) {
      deleteOneDto.imageUser = imageUser[i];
    }

    for(let i = 0; i < image.length; i++) {
      deleteOneDto.image = image[i];
    }

    const newImage = new Image();
    newImage.registeredUser = user.id;
    newImage.updatedUser = user.id;
    newImage.url = STATIC_PATH + URL_SEP + USER_PATH + URL_SEP + userDto.imageUrl;
    
    const newImageUser = new ImageUser();
    newImageUser.isPrimary = true;
    newImageUser.user = user;
    newImageUser.image = newImage;
    newImageUser.registeredUser = user.id;
    newImageUser.updatedUser = user.id;
    
    user.updatedUser = user.id;
    createOneDto.user = user;
    createOneDto.image = newImage;
    createOneDto.imageUser = newImageUser;

    const result = userRepository.deleteAndInsertImage({
      createOneDto,
      deleteOneDto,
    });

    return result;
  }
}

export const userService = new UserService();
