import { Router } from 'express';
import { userController } from '../controllers/user.controller';

const router = Router();

router.get("/", userController.findByEmail);
router.get('/:id', userController.findByIdWithRole);

export const userRouter = router;
