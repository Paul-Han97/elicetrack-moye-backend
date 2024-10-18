import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import upload from '../middlewares/multer.middleware';
import { auth } from '../middlewares/auth.middleware';
const router = Router();

router.get('/', userController.findByEmail);
router.get('/:id', userController.findByIdWithRole);
router.post('/', userController.signup);
router.put('/:id/uploads', auth, upload, userController.updateImage);

export const userRouter = router;
