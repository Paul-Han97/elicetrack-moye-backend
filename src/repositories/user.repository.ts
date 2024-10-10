import { AppDataSource } from '../db/datasource';
import { CredentialType } from '../entities/credential-type.entity';
import { Credential } from '../entities/credential.entity';
import { Reservation } from '../entities/reservation.entity';
import { Role } from '../entities/role.entity';
import { Store } from '../entities/store.entity';
import { UserCredential } from '../entities/user-credential.entity';
import { User } from '../entities/user.entity';
import { serverMessage, statusMessage } from '../utils/message.util';

const repository = AppDataSource.getRepository(User);

class UserRepository {
  async findByEmail(email: string) {
    return await repository.findOne({
      where: {
        email,
      },
    });
  }

  async findByIdWithRole(id: number) {
    const sql = await repository
        .createQueryBuilder('A')
        .leftJoinAndMapOne('A.userCredential', UserCredential, 'B', 'A.id = B.user_id')
        .leftJoinAndMapOne('B.credential', Credential, 'C', 'B.credential_id = C.id')
        .leftJoinAndMapOne('C.role', Role, 'D', 'C.role_id = D.id')
        .leftJoinAndMapMany('A.store', Store, 'E', 'A.id = E.user_id')
        .leftJoinAndMapMany('A.reservation', Reservation, 'F', 'A.id = F.user_id')
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
        role: sql.userCredential.credential.role.type,
        stores: sql.store,
        reservations: sql.reservation
    };

    return result;
  }

  async loadUserByUsername(username:string) {
    const sql = await repository
        .createQueryBuilder('A')
        .leftJoinAndMapOne('A.userCredential', UserCredential, 'B', 'A.id = B.user_id')
        .leftJoinAndMapOne('B.credential', Credential, 'C', 'B.credential_id = C.id')
        .leftJoinAndMapOne('C.credentialType', CredentialType, 'D', 'C.credential_type_id = D.id')
        .leftJoinAndMapOne('C.role', Role, 'E', 'C.role_id = E.id')
        .where ('A.email = :username', { username })
        .getOne();

    if(!sql) {
      const message = `${statusMessage.NOT_FOUND}+${serverMessage.E004}`
      throw new Error(message);
    }

    const result = {
      id: sql.id,
      email: sql.email,
      password: sql.userCredential.credential.password,
      role: sql.userCredential.credential.role.type,
      credentialType: sql.userCredential.credential.credentialType.type
    }

    return result;
  }
}
export const userRepository = new UserRepository();
