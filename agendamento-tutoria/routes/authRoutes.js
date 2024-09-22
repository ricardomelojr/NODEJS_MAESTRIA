import express from 'express';
const router = express.Router();

import AuthController from '../controllers/authController.js';

/* GET */
router.get('/login', AuthController.login);
router.get('/register', AuthController.register);
router.get('/logout', AuthController.logout);

/* POST */
router.post('/login', AuthController.loginPost);
router.post('/register', AuthController.registerPost);

export default router;
