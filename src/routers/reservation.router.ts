import { Router } from 'express';
import { reservationController } from '../controllers/reservation.controller';

const router = Router();

router.get('/:storeId/stores', reservationController.findByStoreIdGroupByDate);

export const reservationRouter = router;
