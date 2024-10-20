import { Router } from 'express';
import { reservationController } from '../controllers/reservation.controller';

const router = Router();

router.post('/', reservationController.createOne);
router.put('/:id', reservationController.updateState);

export const reservationRouter = router;
