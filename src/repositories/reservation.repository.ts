import { AppDataSource } from '../db/datasource';
import { Reservation } from '../entities/reservation.entity';
import { IFindAllUser, IFindMonthlyReservationByStoreId, IFindUserByName, IFindUserByPhone } from '../interfaces/reservation.interface';
import { reservationQuery } from '../utils/sql-query.util';

const repository = AppDataSource.getRepository(Reservation);

class ReservationRepository {
  async findMonthlyReservationByStoreId({ storeId, month }: IFindMonthlyReservationByStoreId){
    const sql = reservationQuery.findMonthlyReservationByStoreId;
    return await repository.query(sql, [storeId, month]);
  }

  async findTodayReservationByStoreId(storeId: number) {
    const sql = reservationQuery.findTodayReservationByStoreId;
    return await repository.query(sql, [storeId]);
  }

  async findAllUser({ storeId, skip }: IFindAllUser) {
    const sql = reservationQuery.findAllUser;
    return await repository.query(sql, [storeId, Number(skip)]);
  }

  async findUserByName({ storeId, name }: IFindUserByName) {
    const like = `%${name}%`;
    const sql = reservationQuery.findUserByName;
    return await repository.query(sql, [storeId, like])
  }
  
  async findUserByPhone({ storeId, phone }: IFindUserByPhone) {
    const like = `%${phone}%`;
    const sql = reservationQuery.findUserByPhone;
    return await repository.query(sql, [storeId, like])
  }
}

export const reservationRepository = new ReservationRepository();
