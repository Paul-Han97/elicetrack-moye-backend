import { Router } from 'express';
import { reservationController } from '../controllers/reservation.controller';

const router = Router();

router.put('/:id', reservationController.createOne);

export const reservationRouter = router;
