import { AppDataSource } from '../db/datasource';
import { Reservation } from '../entities/reservation.entity';
import {
  IFindAllUser,
  IFindMonthlyReservationByStoreId,
  IFindUserByName,
  IFindUserByPhone,
} from '../interfaces/store.interface';
import { reservationQuery } from '../utils/sql-query.util';

const repository = AppDataSource.getRepository(Reservation);

class ReservationRepository {
  async findMonthlyReservationByStoreId({
    id,
    month,
  }: IFindMonthlyReservationByStoreId) {
    const sql = reservationQuery.findMonthlyReservationByStoreId;
    return await repository.query(sql, [id, month]);
  }

  async findTodayReservationByStoreId(id: number) {
    const sql = reservationQuery.findTodayReservationByStoreId;
    return await repository.query(sql, [id]);
  }

  async findAllUser({ id, skip }: IFindAllUser) {
    const sql = reservationQuery.findAllUser;
    return await repository.query(sql, [id, Number(skip)]);
  }

  async findUserByName({ id, name }: IFindUserByName) {
    const leftSideLike = `%${name}`;
    const rightSideLike = `${name}%`;

    const sql = reservationQuery.findUserByName;

    const leftSide = await repository.query(sql, [id, leftSideLike]);
    const rightSide = await repository.query(sql, [id, rightSideLike]);

    return [...leftSide, ...rightSide];
  }

  async findUserByPhone({ id, phone }: IFindUserByPhone) {
    const leftSideLike = `%${phone}`;
    const rightSideLike = `${phone}%`;

    const sql = reservationQuery.findUserByPhone;

    const leftSide = await repository.query(sql, [id, leftSideLike]);
    const rightSide = await repository.query(sql, [id, rightSideLike]);

    return [...leftSide, ...rightSide];
  }

  async findById(id:number) {
    return await repository.findOneBy({id});
  }

  async updateOne(reservation: Reservation) {
    return await repository.save(reservation);
  }
}

export const reservationRepository = new ReservationRepository();
