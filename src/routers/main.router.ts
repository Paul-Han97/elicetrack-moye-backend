import { Router } from 'express';
import { mainController } from '../controllers/main.controller';
import upload from '../middlewares/multer.middleware';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', mainController.login);
router.get('/refresh', mainController.refresh);
router.post('/uploads/:storeId', auth, upload, mainController.uploads);

export const mainRouter = router;