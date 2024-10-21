import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import upload from '../middlewares/multer.middleware';
import { auth } from '../middlewares/auth.middleware';
const router = Router();

router.get('/', auth, userController.findByEmail);
router.get('/:id', auth, userController.findByIdWithRole);
router.post('/', userController.signup);
router.put('/:id/uploads', auth, upload, userController.updateImage);

export const userRouter = router;
