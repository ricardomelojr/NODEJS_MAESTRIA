import { Router } from 'express';
import UserController from '../controllers/UserController.js';

/*
 * MIDDLEWARES
 */
import verifyToken from '../helpers/verify-token.js';
import imageUpload from '../helpers/image-upload.js';

const router = Router();

router.get('/checkuser', UserController.checkUser);
router.post('/register', UserController.register);
router.get('/:id', UserController.getUserById);
router.post('/login', UserController.login);
router.patch(
  '/edit/:id',
  verifyToken,
  imageUpload.single('image'),
  UserController.editUser
);

export default router;
