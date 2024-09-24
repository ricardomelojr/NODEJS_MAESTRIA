import express from 'express';
import StudentController from '../controllers/StudentController.js'; // Importar o controlador do aluno
import { ensureAuthenticated } from '../middlewares/authMiddleware.js'; // Verifica se o usuário está autenticado

const router = express.Router();

// Middleware para verificar se o aluno está autenticado
router.use(ensureAuthenticated);

// Rota para o dashboard do aluno
router.get('/dashboard', StudentController.dashboard);

export default router;
