import express from 'express';
const router = express.Router();

import AuthController from '../controllers/authController.js';

/* GET */
router.get('/register', AuthController.register);

/* POST */
router.post('/register', AuthController.registerPost); // Esta é a rota POST que processa o registro

export default router;
