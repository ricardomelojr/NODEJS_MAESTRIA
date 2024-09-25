import express from 'express';
import StudentController from '../controllers/StudentController.js';
import { ensureAuthenticated } from '../middlewares/authMiddleware.js'; // Middleware para verificar autenticação

const router = express.Router();

// Middleware para verificar se o aluno está autenticado
router.use(ensureAuthenticated);

// Rota para o dashboard do aluno
router.get('/dashboard', StudentController.dashboard);

// Rota para listar os monitores e suas disponibilidades
router.get('/tutors', StudentController.tutors);

// Rota para realizar inscrição na monitoria
router.post('/tutors/register', StudentController.registerTutoring);

export default router;
