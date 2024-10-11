import { CREDENTIAL_TYPE, ROLE_TYPE } from '../constants';
import { CredentialType } from '../entities/credential-type.entity';
import { Credential } from '../entities/credential.entity';
import { Role } from '../entities/role.entity';
import { UserCredential } from '../entities/user-credential.entity';
import { User } from '../entities/user.entity';
import { IGenerate } from '../interface/token.interface';
import { ISignup, IUser } from '../interface/user.interface';
import { userRepository } from '../repositories/user.repository';
import { Encrypt } from '../utils/encrypt.util';
import { serverMessage, statusMessage } from '../utils/message.util';
import { Token } from '../utils/token.util';

class UserService {
  async findByEmail(email:string) {
    return await userRepository.findByEmail(email);
  }

  async findByIdWithRole(id: number) {
    return await userRepository.findByIdWithRole(id);
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

  async signup({email, name, phone, password}:IUser) {
    const hasUser = await userRepository.findByEmail(email);

    if(hasUser) {
      const msg = `${statusMessage.BAD_REQUEST}+이미 계정이 존재합니다.`;
      throw new Error(msg);
    }

    const user = new User();
    user.email = email;
    user.name = name;
    user.phone = phone;

    const credentialType = new CredentialType();
    credentialType.id = CREDENTIAL_TYPE.LOCAL_ID

    const role =  new Role();
    role.id = ROLE_TYPE.MANAGER_ID;

    const credential = new Credential();
    credential.password = Encrypt.encode(password);
    credential.credentialType = credentialType;
    credential.role = role;

    const userCredential = new UserCredential();
    userCredential.user = user;
    userCredential.credential = credential;

    const signupDto:ISignup = {
      user,
      credential,
      userCredential
    }

    const result = userRepository.signup(signupDto);

    return result;
  }
}

export const userService = new UserService();
