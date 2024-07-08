// UserRoutes.js
import { Router } from 'express';
import UserController from '../controllers/UserController.js';

const router = Router();

// Register route
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/checkuser', UserController.checkUser);

export default router;
