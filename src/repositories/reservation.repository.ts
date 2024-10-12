import { AppDataSource } from '../db/datasource';
import { Reservation } from '../entities/reservation.entity';
import { IFindByStoreIdGroupByDate } from '../interface/reservation.interface';
import { reservationQuery } from '../utils/sql-query.util';

const repository = AppDataSource.getRepository(Reservation);

class ReservationRepository {
  async findByStoreIdGroupByDate({ storeId, month }: IFindByStoreIdGroupByDate){
    console.log('storeId', storeId)
    const sql = reservationQuery.findByStoreIdGroupByDate;
    return await repository.query(sql, [ storeId, month ]);
  }
}

export const reservationRepository = new ReservationRepository();
