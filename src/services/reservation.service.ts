import { RESERVATION_TYPE, RESERVATION_TYPE_ID } from '../constants';
import { ReservationState } from '../entities/reservation-state.entity';
import { Reservation } from '../entities/reservation.entity';
import { IRequest, IUpdateState } from '../interfaces/reservation.interface';
import { reservationRepository } from '../repositories/reservation.repository';
import { storeRepository } from '../repositories/store.repository';
import { userRepository } from '../repositories/user.repository';
import { getTime } from '../utils/date.util';
import { serverMessage, statusMessage } from '../utils/message.util';

class ReservationService {
  async updateState(updateStateDto: IUpdateState) {
    const reservation = await reservationRepository.findById(updateStateDto.id);

    if (!reservation) {
      const msg = `${statusMessage.BAD_REQUEST}+${serverMessage.E001}`;
      throw new Error(msg);
    }

    const reservationStateType = <
      | RESERVATION_TYPE.ACCEPT
      | RESERVATION_TYPE.CANCEL
      | RESERVATION_TYPE.PENDING
    >updateStateDto.state.toUpperCase();

    const reservationState = new ReservationState();
    reservationState.id = RESERVATION_TYPE_ID[reservationStateType];
    reservationState.type = RESERVATION_TYPE[reservationStateType];
    reservation.reservationState = reservationState;
    reservation.registeredUser = updateStateDto.userId;
    reservation.updatedUser = updateStateDto.userId;

    const result = await reservationRepository.updateState(reservation);

    return result;
  }

  async createOne(requestDto:IRequest) {
    const store = await storeRepository.findById(requestDto.storeId);
    const user = await userRepository.findById(requestDto.userId);

    if(!user) {
      const msg = `${statusMessage.NOT_FOUND}+${serverMessage.E008}`
      throw new Error(msg);
    }

    if(!store) {
      const msg = `${statusMessage.NOT_FOUND}+${serverMessage.E008}`
      throw new Error(msg);
    }
    
    const reservationState = new ReservationState();
    reservationState.id = RESERVATION_TYPE_ID.PENDING;

    const reservation = new Reservation();
    reservation.user = user;
    reservation.count = requestDto.count;
    reservation.description = requestDto.description;
    reservation.startTime = getTime(requestDto.startTime);
    reservation.endTime = getTime(requestDto.endTime);
    reservation.reservationState = reservationState;
    reservation.store = store;
    reservation.registeredUser = requestDto.userId;
    reservation.updatedUser = requestDto.userId;

    await reservationRepository.createOne(reservation);
    return serverMessage.S007;
  }
}

export const reservationService = new ReservationService();
