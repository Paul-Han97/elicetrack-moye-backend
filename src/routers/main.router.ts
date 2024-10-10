import { Router } from 'express';
import { mainController } from '../controllers/main.controller';

const router = Router();

router.post('/login', mainController.login);

export const mainRouter = router;
