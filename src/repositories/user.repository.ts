import { AppDataSource } from '../db/datasource';
import { CredentialType } from '../entities/credential-type.entity';
import { Credential } from '../entities/credential.entity';
import { Reservation } from '../entities/reservation.entity';
import { Role } from '../entities/role.entity';
import { Store } from '../entities/store.entity';
import { UserCredential } from '../entities/user-credential.entity';
import { User } from '../entities/user.entity';
import { ISignup } from '../interface/user.interface';
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
      .leftJoinAndMapOne(
        'A.userCredential',
        UserCredential,
        'B',
        'A.id = B.user_id'
      )
      .leftJoinAndMapOne(
        'B.credential',
        Credential,
        'C',
        'B.credential_id = C.id'
      )
      .leftJoinAndMapOne('C.role', Role, 'D', 'C.role_id = D.id')
      .leftJoinAndMapMany('A.store', Store, 'E', 'A.id = E.user_id')
      .leftJoinAndMapMany('A.reservation', Reservation, 'F', 'A.id = F.user_id')
      .where('A.id = :id', { id })
      .getOne();

    if (!sql) {
      const message = `${statusMessage.NOT_FOUND}+${serverMessage.E003}`;
      throw new Error(message);
    }

    const result = {
      email: sql.email,
      name: sql.name,
      phone: sql.phone,
      role: sql.userCredential.credential.role.type,
      stores: sql.store,
      reservations: sql.reservation,
    };

    return result;
  }

  async loadUserByEmail(email: string) {
    const sql = await repository
      .createQueryBuilder('A')
      .leftJoinAndMapOne(
        'A.userCredential',
        UserCredential,
        'B',
        'A.id = B.user_id'
      )
      .leftJoinAndMapOne(
        'B.credential',
        Credential,
        'C',
        'B.credential_id = C.id'
      )
      .leftJoinAndMapOne(
        'C.credentialType',
        CredentialType,
        'D',
        'C.credential_type_id = D.id'
      )
      .leftJoinAndMapOne('C.role', Role, 'E', 'C.role_id = E.id')
      .where('A.email = :email', { email })
      .getOne();

    if (!sql) {
      const message = `${statusMessage.NOT_FOUND}+${serverMessage.E004}`;
      throw new Error(message);
    }

    const result = {
      id: sql.id,
      email: sql.email,
      password: sql.userCredential.credential.password,
      role: sql.userCredential.credential.role.type,
      credentialType: sql.userCredential.credential.credentialType.type,
    };

    return result;
  }

  async createOne(user: User) {
    const newUser = repository.create(user);
    return await repository.save(newUser);
  }

  async signup(signupDto: ISignup) {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const manager = queryRunner.manager;

    try {
      await manager.getRepository(User).save(signupDto.user);
      await manager.getRepository(Credential).save(signupDto.credential);
      await manager.getRepository(UserCredential).save(signupDto.userCredential);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      const msg = `${statusMessage.INTERNAL_SERVER_ERROR}+${serverMessage.E005}`;
      throw new Error(msg);
    } finally {
      await queryRunner.release();
    }

    return serverMessage.S001;
  }
}
export const userRepository = new UserRepository();
