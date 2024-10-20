export interface IUpdateState {
    id: number,
    userId: number,
    state: string
}

export interface IRequest {
    storeId: number;
    userId: number;
    description: string;
    count: number;
    startTime: string;
    endTime: string;
}