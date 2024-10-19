import { Router } from 'express';
import { storeController } from '../controllers/store.controller';
import upload from '../middlewares/multer.middleware';

const router = Router();

router.get('/', storeController.getAllSimpleStoreInformation)
router.get('/:id/reservations', storeController.findByMonthOrToday);
router.get('/:id', storeController.getAllStoreInformation);
router.post('/', upload, storeController.createOne);
router.put('/:id', upload, storeController.updateOne);

export const storeRouter = router;
