import express from 'express';
import UserController from '../controllers/UserController.js'; // Certifique-se de ajustar o caminho

const router = express.Router();

// Rota para exibir todos os monitores
router.get('/monitores', UserController.exibirMonitores);

export default router;
