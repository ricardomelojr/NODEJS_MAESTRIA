import express from 'express';
const router = express.Router();

import AlunoController from '../controllers/alunoController.js';
import {
  ensureAluno,
  ensureAuthenticated,
} from '../middlewares/authMiddleware.js';

// Rota protegida para Aluno
router.get(
  '/dashboard',
  ensureAuthenticated,
  ensureAluno,
  AlunoController.alunoDashboard
);

export default router;
