import { RESERVATION_TYPE, RESERVATION_TYPE_ID } from '../constants';
import { ReservationState } from '../entities/reservation-state.entity';
import { IUpdateOneDTo } from '../interfaces/reservation.interface';
import { reservationRepository } from '../repositories/reservation.repository';
import { serverMessage, statusMessage } from '../utils/message.util';

class ReservationService {
  async updateOne(updateOneDto: IUpdateOneDTo) {
    const reservation = await reservationRepository.findById(updateOneDto.id);

    if (!reservation) {
      const msg = `${statusMessage.BAD_REQUEST}+${serverMessage.E001}`;
      throw new Error(msg);
    }

    const reservationStateType = <
      | RESERVATION_TYPE.ACCEPT
      | RESERVATION_TYPE.CANCEL
      | RESERVATION_TYPE.PENDING
    >updateOneDto.state.toUpperCase();

    const reservationState = new ReservationState();
    reservationState.id = RESERVATION_TYPE_ID[reservationStateType];
    reservationState.type = RESERVATION_TYPE[reservationStateType];
    reservation.reservationState = reservationState;
    reservation.registeredUser = updateOneDto.userId;
    reservation.updatedUser = updateOneDto.userId;

    const result = await reservationRepository.updateOne(reservation);

    return result;
  }
}

export const reservationService = new ReservationService();
