export interface IFindMonthlyReservationByStoreId {
    storeId : number;
    month : number;
}

export interface IFindAllUser {
    storeId: number;
    skip: number;
}

export interface IFindUserByPhone {
    storeId: number;
    phone: string;
}

export interface IFindUserByName {
    storeId: number;
    name: string;
}