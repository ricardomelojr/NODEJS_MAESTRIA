import express from 'express';
import TutorController from '../controllers/TutorController.js'; // Importa o controlador
import { ensureAuthenticated, isTutor } from '../middlewares/authMiddleware.js'; // Importa os middlewares

const router = express.Router();

// Aplicar middlewares
router.use(ensureAuthenticated);
router.use(isTutor);

// Rota para o dashboard do tutor
router.get('/dashboard', TutorController.dashboard);

// Rota para a visualização da agenda do tutor
router.get('/schedule', TutorController.schedule);
router.get('/attendance/history', TutorController.attendanceHistory);
// Rota para gerenciamento de presença (adicionada)
router.get('/attendance/:id', TutorController.attendance);

// Rota para salvar a lista de presença
router.post('/attendance/:id', TutorController.saveAttendance);

export default router;
