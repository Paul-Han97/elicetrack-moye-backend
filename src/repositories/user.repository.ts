import { STATIC_PATH, URL_SEP } from '../constants';
import { AppDataSource } from '../db/datasource';
import { CredentialType } from '../entities/credential-type.entity';
import { Credential } from '../entities/credential.entity';
import { ImageStore } from '../entities/image-store.entity';
import { ImageUser } from '../entities/image-user.entity';
import { Image } from '../entities/image.entity';
import { Reservation } from '../entities/reservation.entity';
import { Role } from '../entities/role.entity';
import { Store } from '../entities/store.entity';
import { UserCredential } from '../entities/user-credential.entity';
import { User } from '../entities/user.entity';
import { ICreateOne, IDeleteOne, ISignup } from '../interfaces/user.interface';
import { fileUtil } from '../utils/file.util';
import { serverMessage, statusMessage } from '../utils/message.util';
import { userQuery } from '../utils/sql-query.util';

const repository = AppDataSource.getRepository(User);

class UserRepository {
  async findById(id: number) {
    return await repository.findOneBy({
      id: id,
    });
  }

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
      .leftJoinAndMapOne('A.imageUser', ImageUser, 'G', 'A.id = G.user_id')
      .leftJoinAndMapOne('G.image', Image, 'H', 'G.image_id = H.id')
      .leftJoinAndMapMany('E.imageStore', ImageStore, 'I', 'E.id = I.store_id')
      .leftJoinAndMapMany('I.image', Image, 'J', 'J.id = I.image_id')
      .where('A.id = :id', { id })
      .getOne();

    if (!sql) {
      const message = `${statusMessage.NOT_FOUND}+${serverMessage.E003}`;
      throw new Error(message);
    }

    return sql;
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
      const newUser = await manager.getRepository(User).save(signupDto.user);
      signupDto.credential.registeredUser = newUser.id;
      signupDto.credential.updatedUser = newUser.id;

      signupDto.userCredential.registeredUser = newUser.id;
      signupDto.userCredential.updatedUser = newUser.id;

      await manager.getRepository(Credential).save(signupDto.credential);
      await manager
        .getRepository(UserCredential)
        .save(signupDto.userCredential);

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

  async findImageById(id: number) {
    const sql = userQuery.findImageById;
    return await repository.query(sql, [id]);
  }

  async deleteAndInsertImage({
    createOneDto,
    deleteOneDto,
  }: {
    createOneDto: ICreateOne;
    deleteOneDto: IDeleteOne;
  }) {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const manager = queryRunner.manager;

    try {
      await manager.getRepository(User).save(createOneDto.user);

      await manager.getRepository(Image).save(createOneDto.image);

      await manager.getRepository(ImageUser).save(createOneDto.imageUser);

      if(deleteOneDto.imageUser) {
        await manager.getRepository(ImageUser).delete({id:deleteOneDto.imageUser.id});
      }

      if(deleteOneDto.image) {
        console.log(deleteOneDto.image);
        const separator = STATIC_PATH + URL_SEP;
        const url = deleteOneDto.image.url.split(separator)[1];
        const dir = fileUtil.join(fileUtil.cwd, url);
        fileUtil.remove(dir);
        await manager.getRepository(Image).delete({id:deleteOneDto.image.id});
      }

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      const msg = `${statusMessage.INTERNAL_SERVER_ERROR}+${serverMessage.E005}`;
      throw new Error(msg);
    } finally {
      await queryRunner.release();
    }

    const result = {
      message: serverMessage.S006,
    };

    return result;
  }
}
export const userRepository = new UserRepository();
