import { AppDataSource } from '../db/datasource';
import { Credential } from '../entities/credential.entity';
import { Role } from '../entities/role.entity';
import { UserCredential } from '../entities/user-credential.entity';
import { User } from '../entities/user.entity';
import { serverMessage, statusMessage } from '../utils/message.util';

const repository = AppDataSource.getRepository(User);

class UserRepository {
  async findOneByEmail(email: string) {
    return await repository.findOne({
      where: {
        email,
      },
    });
  }

  async findByIdWithRole(id: number) {
    const sql = await repository
        .createQueryBuilder('A')
        .select(['A.email', 'D.type'])
        .leftJoinAndMapOne('A.userCredential', UserCredential, 'B', 'A.id = B.user_id')
        .leftJoinAndMapOne('B.credential', Credential, 'C', 'B.credential_id = C.id')
        .leftJoinAndMapOne('C.role', Role, 'D', 'C.role_id = D.id')
        .where('A.id = :id', { id })
        .getOne();

    if(!sql) {
      const message = `${statusMessage.NOT_FOUND}+${serverMessage.E003}`
      throw new Error(message);
    } 

    const result = {
        email: sql.email,
        name: sql.name,
        phone: sql.phone,
        role: sql.userCredential.credential.role
    };

    return result;
  }
}
export const userRepository = new UserRepository();
