import { Any } from 'typeorm';
import { userRepository } from '../repositories/user.repository';

class UserService {
  async findByIdWithRole(id: number) {
    return await userRepository.findByIdWithRole(id);
  }
}

export const userService = new UserService();