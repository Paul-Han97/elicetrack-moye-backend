import { IGenerate } from '../interface/token.interface';
import { userRepository } from '../repositories/user.repository';
import { Encrypt } from '../utils/encrypt.util';
import { serverMessage, statusMessage } from '../utils/message.util';
import { Token } from '../utils/token.util';

class UserService {
  async findByIdWithRole(id: number) {
    return await userRepository.findByIdWithRole(id);
  }

  async loadUserByUsername(username: string, password: string) {
    const user = await userRepository.loadUserByUsername(username);

    const isMatches = Encrypt.matches(password, user.password);
    console.log('isMatches', isMatches);

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
}

export const userService = new UserService();
