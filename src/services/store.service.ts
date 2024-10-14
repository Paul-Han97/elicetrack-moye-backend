import { RESERVATION_TYPE, WEEK, WEEK_TYPE, WEEKDAYS_TYPE } from '../constants';
import { Day } from '../entities/day.entity';
import { OpeningHour } from '../entities/opening-hour.entity';
import { StoreDefaultOpeningHour } from '../entities/store-default-opening-hour.entity';
import { StoreOpeningHourOverride } from '../entities/store-opening-hour-override.entity';
import { Store } from '../entities/store.entity';
import { User } from '../entities/user.entity';
import {
  IFindMonthlyReservationByStoreId,
  IFindAllUser,
  IFindUserByName,
  IFindUserByPhone,
} from '../interfaces/store.interface';
import { ICreateOne, IStore } from '../interfaces/store.interface';
import { reservationRepository } from '../repositories/reservation.repository';
import { storeRepository } from '../repositories/store.repository';
import { getTime, getYmd } from '../utils/date.util';

class StoreService {
  async createOne(params: IStore) {
    const user = new User();
    user.id = params.userId;

    const store = new Store();
    store.user = user;
    store.businessRegistrationNumber = params.businessRegistrationNumber;
    store.businessName = params.businessName;
    store.description = params.description;
    store.name = params.name;
    store.address = params.address;
    store.contact = params.contact;
    store.seatCount = params.totalSeats;
    store.tableCount = params.numberPerTable;
    store.registerUser = params.userId;
    store.updateUser = params.userId;

    const createOneDto: ICreateOne = {
      store: store,
      storeOpeningHourOverride: [],
      storeDefaultOpeningHour: [],
      openingHour: [],
    };

    for (let i = 0; i < params.closedDay.length; i++) {
      const storeOpeningHourOverride = new StoreOpeningHourOverride();
      storeOpeningHourOverride.store = store;
      storeOpeningHourOverride.registerUser = params.userId;
      storeOpeningHourOverride.updateUser = params.userId;
      storeOpeningHourOverride.isClosed = true;
      storeOpeningHourOverride.closeTo = getYmd(params.closedDay[i]);
      createOneDto.storeOpeningHourOverride.push(storeOpeningHourOverride);
    }

    for (let i = WEEK_TYPE.SUN; i <= WEEK; i++) {
      const day = new Day();
      day.id = i;

      const storeDefaultOpeningHour = new StoreDefaultOpeningHour();
      storeDefaultOpeningHour.store = store;
      storeDefaultOpeningHour.day = day;
      storeDefaultOpeningHour.registerUser = params.userId;
      storeDefaultOpeningHour.updateUser = params.userId;

      createOneDto.storeDefaultOpeningHour.push(storeDefaultOpeningHour);

      const openingHour = new OpeningHour();
      openingHour.storeDefaultOpeningHour = storeDefaultOpeningHour;
      openingHour.registerUser = params.userId;
      openingHour.updateUser = params.userId;

      if (!params.dayOfWeekDay.includes(i)) {
        openingHour.openFrom = getTime(params.openingHour[i].openFrom);
        openingHour.closeTo = getTime(params.openingHour[i].closeTo);

        if (params.afterBreakTime.length > 0) {
          const afterBreakTime = new OpeningHour();
          afterBreakTime.storeDefaultOpeningHour = storeDefaultOpeningHour;
          afterBreakTime.registerUser = params.userId;
          afterBreakTime.updateUser = params.userId;
          afterBreakTime.openFrom = getTime(params.afterBreakTime[i].openFrom);
          afterBreakTime.closeTo = getTime(params.afterBreakTime[i].closeTo);

          createOneDto.openingHour.push(afterBreakTime);
        }
      }

      createOneDto.openingHour.push(openingHour);
    }

    const result = await storeRepository.createOne(createOneDto);

    return result;
  }

  async findMonthlyReservationByStoreId({
    id,
    month,
  }: IFindMonthlyReservationByStoreId) {
    const results = await reservationRepository.findMonthlyReservationByStoreId(
      { id, month }
    );
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

  async findTodayReservationByStoreId(id: number) {
    const openingHour = await storeRepository.findOpeningHour(id);
    const reservations = await reservationRepository.findTodayReservationByStoreId(id);

    console.log(openingHour);
    const result = {
      open: openingHour[0].open,
      close: openingHour[0].close,
      reservations
    }
    return result;
  }

  async findAllUser({ id, skip }: IFindAllUser) {
    return await reservationRepository.findAllUser({ id, skip });
  }

  async findUserByName({ id, name }: IFindUserByName) {
    return await reservationRepository.findUserByName({ id, name });
  }

  async findUserByPhone({ id, phone }: IFindUserByPhone) {
    return await reservationRepository.findUserByPhone({ id, phone });
  }
}

export const storeService = new StoreService();
