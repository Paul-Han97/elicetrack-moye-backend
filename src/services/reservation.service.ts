import { RESERVATION_TYPE } from '../constants';
import { IFindByStoreIdGroupByDate } from '../interface/reservation.interface';
import { reservationRepository } from '../repositories/reservation.repository';

class ReservationService {
  async findByStoreIdGroupByDate({ storeId, month } : IFindByStoreIdGroupByDate) {
    const results = await reservationRepository.findByStoreIdGroupByDate({ storeId, month });
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
}

export const reservationService = new ReservationService();
