import { RESERVATION_TYPE, STATIC_PATH, STORE_PATH, URL_SEP, WEEK, WEEK_TYPE } from '../constants';
import { Day } from '../entities/day.entity';
import { ImageStore } from '../entities/image-store.entity';
import { Image } from '../entities/image.entity';
import { OpeningHour } from '../entities/opening-hour.entity';
import { StoreDefaultOpeningHour } from '../entities/store-default-opening-hour.entity';
import { StoreOpeningHourOverride } from '../entities/store-opening-hour-override.entity';
import { Store } from '../entities/store.entity';
import { User } from '../entities/user.entity';
import {
  ICreateOne,
  IDeleteOne,
  IFindAllUser,
  IFindMonthlyReservationByStoreId,
  IFindUserByName,
  IFindUserByPhone,
  IStore,
} from '../interfaces/store.interface';
import { AppError } from '../middlewares/error.middleware';
import { imageStoreRepository } from '../repositories/image-store.repository';
import { openingHourRepository } from '../repositories/opening-hour.repository';
import { reservationRepository } from '../repositories/reservation.repository';
import { storeDefaultOpeningHourRepository } from '../repositories/store-default-opening-hour.repository';
import { storeOpeningHourOverrideRepository } from '../repositories/store-opening-hour-override.repository';
import { storeRepository } from '../repositories/store.repository';
import { getTime, getYmd } from '../utils/date.util';
import { serverMessage, errorName } from '../utils/message.util';

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
    store.registeredUser = params.userId;
    store.updatedUser = params.userId;

    const createOneDto: ICreateOne = {
      store: store,
      storeOpeningHourOverride: [],
      storeDefaultOpeningHour: [],
      openingHour: [],
      imageStore: [],
      image: [],
    };

    if(params.url) {
      for(let i = 0; i < params.url.length; i++) {
        const image = new Image();
        image.url = STATIC_PATH + URL_SEP + STORE_PATH + URL_SEP + params.url[i];
        image.registeredUser = user.id;
        image.updatedUser = user.id;

        const imageStore = new ImageStore();
        imageStore.image = image;
        imageStore.store = store;
        imageStore.registeredUser = user.id;
        imageStore.updatedUser = user.id;

        createOneDto.image.push(image);
        createOneDto.imageStore.push(imageStore);
      }
    }

    if (params.closedDay) {
      for (let i = 0; i < params.closedDay.length; i++) {
        const storeOpeningHourOverride = new StoreOpeningHourOverride();
        storeOpeningHourOverride.store = store;
        storeOpeningHourOverride.registeredUser = params.userId;
        storeOpeningHourOverride.updatedUser = params.userId;
        storeOpeningHourOverride.isClosed = true;
        storeOpeningHourOverride.closeTo = getYmd(params.closedDay[i]);
        createOneDto.storeOpeningHourOverride.push(storeOpeningHourOverride);
      }
    }

    for (let i = WEEK_TYPE.SUN - 1; i < WEEK; i++) {
      const day = new Day();
      day.id = i + 1;

      const storeDefaultOpeningHour = new StoreDefaultOpeningHour();
      storeDefaultOpeningHour.store = store;
      storeDefaultOpeningHour.day = day;
      storeDefaultOpeningHour.registeredUser = params.userId;
      storeDefaultOpeningHour.updatedUser = params.userId;

      createOneDto.storeDefaultOpeningHour.push(storeDefaultOpeningHour);

      const openingHour = new OpeningHour();
      openingHour.storeDefaultOpeningHour = storeDefaultOpeningHour;
      openingHour.registeredUser = params.userId;
      openingHour.updatedUser = params.userId;

      const isBusinessDay = !params?.dayOfWeekDay?.includes(i);
      if (isBusinessDay) {
        openingHour.openFrom = getTime(params.openingHour[i].openFrom);
        openingHour.closeTo = getTime(params.openingHour[i].closeTo);

        if (params.afterBreakTime.length > 0) {
          const afterBreakTime = new OpeningHour();
          afterBreakTime.storeDefaultOpeningHour = storeDefaultOpeningHour;
          afterBreakTime.registeredUser = params.userId;
          afterBreakTime.updatedUser = params.userId;
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

  async deleteAndCreate(params: IStore) {
    const store = await storeRepository.findById(params.id);

    if (!store) {
      throw new AppError(errorName.BAD_REQUEST, serverMessage.E001, true);
    }

    const user = new User();
    user.id = params.userId;

    store.user = user;
    store.businessRegistrationNumber = params.businessRegistrationNumber;
    store.businessName = params.businessName;
    store.description = params.description;
    store.name = params.name;
    store.address = params.address;
    store.contact = params.contact;
    store.seatCount = params.totalSeats;
    store.tableCount = params.numberPerTable;
    store.updatedUser = params.userId;

    const createOneDto: ICreateOne = {
      store: store,
      storeOpeningHourOverride: [],
      storeDefaultOpeningHour: [],
      openingHour: [],
      imageStore: [],
      image: [],
    };

    const deleteOneDto: IDeleteOne = {
      store: new Store(),
      storeOpeningHourOverride: [],
      storeDefaultOpeningHour: [],
      openingHour: [],
      imageStore: [],
      image: [],
    };

    if(params.url) {
      for(let i = 0; i < params.url.length; i++) {
        const image = new Image();
        image.url = STATIC_PATH + URL_SEP + STORE_PATH + URL_SEP + params.url[i];
        image.registeredUser = user.id;
        image.updatedUser = user.id;

        const imageStore = new ImageStore();
        imageStore.image = image;
        imageStore.store = store;
        imageStore.registeredUser = user.id;
        imageStore.updatedUser = user.id;

        createOneDto.image.push(image);
        createOneDto.imageStore.push(imageStore);
      }
    }
    
    deleteOneDto.image = await storeRepository.findImageById(store.id);
    deleteOneDto.imageStore = await imageStoreRepository.findByStore(store);
    deleteOneDto.storeOpeningHourOverride = await storeOpeningHourOverrideRepository.findByStore(store);
    createOneDto.storeDefaultOpeningHour = await storeDefaultOpeningHourRepository.findByStore(store);

    for (let i = 0; i < createOneDto.storeDefaultOpeningHour.length; i++) {
      const openingHour = await openingHourRepository.findByStoreDefaultOpeningHour(createOneDto.storeDefaultOpeningHour[i]);
      if (openingHour) {
        deleteOneDto.openingHour.push(openingHour);
      }
    }

    if (params.closedDay) {
      for (let i = 0; i < params.closedDay.length; i++) {
        const storeOpeningHourOverride = new StoreOpeningHourOverride();
        storeOpeningHourOverride.store = store;
        storeOpeningHourOverride.registeredUser = params.userId;
        storeOpeningHourOverride.updatedUser = params.userId;
        storeOpeningHourOverride.isClosed = true;
        storeOpeningHourOverride.closeTo = getYmd(params.closedDay[i]);
        createOneDto.storeOpeningHourOverride.push(storeOpeningHourOverride);
      }
    }

    for (let i = WEEK_TYPE.SUN - 1; i < WEEK; i++) {
      const day = new Day();
      day.id = i + 1;

      createOneDto.storeDefaultOpeningHour[i].updatedUser = params.userId;

      const openingHour = new OpeningHour();
      openingHour.storeDefaultOpeningHour = createOneDto.storeDefaultOpeningHour[i];
      openingHour.registeredUser = params.userId;
      openingHour.updatedUser = params.userId;

      const isBusinessDay = !params?.dayOfWeekDay?.includes(i);
      if (isBusinessDay) {
        openingHour.openFrom = getTime(params.openingHour[i].openFrom);
        openingHour.closeTo = getTime(params.openingHour[i].closeTo);

        if (params.afterBreakTime.length > 0) {
          const afterBreakTime = new OpeningHour();
          afterBreakTime.storeDefaultOpeningHour = createOneDto.storeDefaultOpeningHour[i];
          afterBreakTime.registeredUser = params.userId;
          afterBreakTime.updatedUser = params.userId;
          afterBreakTime.openFrom = getTime(params.afterBreakTime[i].openFrom);
          afterBreakTime.closeTo = getTime(params.afterBreakTime[i].closeTo);

          createOneDto.openingHour.push(afterBreakTime);
        }
      }

      createOneDto.openingHour.push(openingHour);
    }

    const result = await storeRepository.deleteAndCreate({ createOneDto, deleteOneDto });

    return result;
  }

  async getAllStoreInformation(id: number) {
    const store = await storeRepository.findByIdWithEmail(id);
    const openingHour = await storeRepository.findOpeningHourById(id);
    const closedDay = await storeRepository.findClosedDayById(id);
    const regularHoliday = await storeRepository.findRegularHolidayById(id);
    const image = await storeRepository.findFormattedImageById(id);

    const result = {
      openingHour,
      closedDay,
      regularHoliday,
      image,
    };

    Object.assign(result, ...store);

    return result;
  }

  async getAllSimpleStoreInformation(skip: number) {
    return await storeRepository.findAllSimpleInformation(skip);
  }

  async findMonthlyReservationByStoreId({ id, month }: IFindMonthlyReservationByStoreId) {
    const results = await reservationRepository.findMonthlyReservationByStoreId({ id, month });
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
    const openingHour = await storeRepository.findTodayOpeningHourById(id);
    const reservations = await reservationRepository.findTodayReservationByStoreId(id);

    const result = {
      open: openingHour[0].open,
      close: openingHour[0].close,
      reservations,
    };
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
