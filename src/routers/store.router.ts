import { Router } from 'express';
import { reservationController } from '../controllers/reservation.controller';
import { storeController } from '../controllers/store.controller';

const router = Router();

router.post('/', storeController.createOne);

export const storeRouter = router;
