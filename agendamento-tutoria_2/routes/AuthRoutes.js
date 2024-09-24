import express from 'express';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

// Rota para exibir o formulário de login
router.get('/login', AuthController.showLoginForm);

// Rota para processar o login
router.post('/login', AuthController.loginUser);

// Rota para exibir o formulário de registro
router.get('/register', AuthController.showRegisterForm);

// Rota para processar o registro de usuário
router.post('/register', AuthController.registerUser);

// Rota para logout
router.get('/logout', AuthController.logoutUser);

export default router;
