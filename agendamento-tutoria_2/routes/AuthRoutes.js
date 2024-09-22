import express from 'express';
import {
  showRegisterForm,
  registerUser,
} from '../controllers/AuthController.js'; // Ajuste o caminho conforme necessário

const router = express.Router();

// Rota para exibir o formulário de registro
router.get('/register', showRegisterForm);

// Rota para processar o registro de um novo usuário
router.post('/register', registerUser);

// Outras rotas de autenticação podem ser adicionadas aqui (login, logout, etc.)

export default router;
