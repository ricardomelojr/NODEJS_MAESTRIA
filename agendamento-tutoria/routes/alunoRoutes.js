import express from 'express';
const router = express.Router();

import AlunoController from '../controllers/alunoController.js';
import {
  ensureAluno,
  ensureAuthenticated,
} from '../middlewares/authMiddleware.js'; // Importa o middleware

/* GET */
// Aplica o middleware ensureAluno e ensureAuthenticated nas rotas de aluno
router.get(
  '/dashboard',
  ensureAuthenticated,
  ensureAluno,
  AlunoController.alunoDashboard
);

export default router;
