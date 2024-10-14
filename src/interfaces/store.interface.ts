import { OpeningHour } from "../entities/opening-hour.entity";
import { StoreDefaultOpeningHour } from "../entities/store-default-opening-hour.entity";
import { StoreOpeningHourOverride } from "../entities/store-opening-hour-override.entity";
import { Store } from "../entities/store.entity";

export interface IOpeningHour {
  openFrom: string;
  closeTo: string;
}

export interface IStore {
  userId: number;
  businessRegistrationNumber: string;
  businessName: string;
  description: string;
  name: string;
  address: string;
  contact: string;
  totalSeats: number;
  numberPerTable: number;
  afterBreakTime: IOpeningHour[];
  openingHour: IOpeningHour[];
  closedDay: string[];
  dayOfWeekDay: number[];
}

export interface ICreateOne {
  store: Store;
  storeOpeningHourOverride: StoreOpeningHourOverride[];
  storeDefaultOpeningHour: StoreDefaultOpeningHour[];
  openingHour: OpeningHour[];
}