export const enum CREDENTIAL_TYPE {
  LOCAL_ID = 1,
}

export const enum ROLE_TYPE {
  USER_ID = 1,
  MANAGER_ID = 2,
  ADMIN_ID = 3,
}

export enum RESERVATION_TYPE_ID {
  ACCEPT = 1,
  PENDING = 2,
  CANCEL = 3,
}

export enum RESERVATION_TYPE {
  ACCEPT = 'ACCEPT',
  PENDING = 'PENDING',
  CANCEL = 'CANCEL',
}

export const PAGINATION_LIMIT = 5;

export const WEEK = 7;

export const enum WEEK_TYPE {
  SUN = 1,
  MON = 2,
  TUE = 3,
  WED = 4,
  THU = 5,
  FRI = 6,
  SAT = 7,
}

export const WEEKDAYS_TYPE = '평일';

export const WEEKEND_TYPE = '주말';

export const STATIC_PATH = 'static';

export const URL_SEP = '/';

// 60 * 60 * 24 * 1000(ms) = (1일, 24시간)
export const COOKIE_MAX_AGE = 86400000;

export const STORE_PATH = 'stores';

export const USER_PATH = 'users';