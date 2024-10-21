import { Router } from 'express';
import { mainController } from '../controllers/main.controller';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', mainController.login);
router.post('/logout', auth, mainController.logout);
router.post('/send-email', auth, mainController.sendEmail)
export const mainRouter = router;
