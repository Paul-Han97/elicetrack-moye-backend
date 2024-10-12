import { RESERVATION_TYPE } from '../constants';
import { IFindMonthlyReservationByStoreId } from '../interfaces/reservation.interface';
import { reservationRepository } from '../repositories/reservation.repository';

class ReservationService {
  async findMonthlyReservationByStoreId({ storeId, month } : IFindMonthlyReservationByStoreId) {
    const results = await reservationRepository.findMonthlyReservationByStoreId({ storeId, month });
    const resultMap = new Map();

    for (const { ymd, type, count } of results) {
      if (resultMap.has(ymd)) {
        const map = resultMap.get(ymd);
        map.set(type, Number(count));
        continue;
      }

      const map = new Map();

      map.set(RESERVATION_TYPE.ACCEPT, 0);
      map.set(RESERVATION_TYPE.PENDING, 0);
      map.set(RESERVATION_TYPE.CANCEL, 0);
      map.set(type, Number(count));

      resultMap.set(ymd, map);
    }

    for (const [key, value] of resultMap) {
      const data = Object.fromEntries(value);
      resultMap.set(key, data);
    }

    return Object.fromEntries(resultMap);
  }

  async findTodayReservationByStoreId(storeId: number) {
    return await reservationRepository.findTodayReservationByStoreId(storeId);
  }
}

export const reservationService = new ReservationService();
