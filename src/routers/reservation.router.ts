import { Router } from 'express';
import { reservationController } from '../controllers/reservation.controller';

const router = Router();

router.get('/:storeId/stores', reservationController.findByMonthOrToday);

export const reservationRouter = router;
