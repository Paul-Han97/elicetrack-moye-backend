import { Router } from 'express';
import { storeController } from '../controllers/store.controller';

const router = Router();

router.post('/', storeController.createOne);
router.get('/:id/reservations', storeController.findByMonthOrToday);
router.get('/:id', storeController.getAllStoreInformation);

export const storeRouter = router;
