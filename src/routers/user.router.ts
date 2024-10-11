import { Router } from 'express';
import { userController } from '../controllers/user.controller';

const router = Router();

router.get("/", userController.findByEmail);
router.get('/:id', userController.findByIdWithRole);
router.post("/", userController.signup);

export const userRouter = router;
