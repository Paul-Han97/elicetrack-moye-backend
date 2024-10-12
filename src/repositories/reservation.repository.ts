import { AppDataSource } from '../db/datasource';
import { Reservation } from '../entities/reservation.entity';
import { IFindMonthlyReservationByStoreId } from '../interfaces/reservation.interface';
import { reservationQuery } from '../utils/sql-query.util';

const repository = AppDataSource.getRepository(Reservation);

class ReservationRepository {
  async findMonthlyReservationByStoreId({ storeId, month }: IFindMonthlyReservationByStoreId){
    const sql = reservationQuery.findMonthlyReservationByStoreId;
    return await repository.query(sql, [ storeId, month ]);
  }

  async findTodayReservationByStoreId(storeId: number) {
    const sql = reservationQuery.findTodayReservationByStoreId;
    return await repository.query(sql, [ storeId ]);
  }
}

export const reservationRepository = new ReservationRepository();
