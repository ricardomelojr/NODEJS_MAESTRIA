import express from 'express';
import TutorController from '../controllers/TutorController.js'; // Importa o controlador
import { ensureAuthenticated, isTutor } from '../middlewares/authMiddleware.js'; // Importa os middlewares

const router = express.Router();

// Aplicar middlewares
router.use(ensureAuthenticated);
router.use(isTutor);

/* GET */
router.get('/dashboard', TutorController.dashboard);
router.get('/schedule', TutorController.schedule);
router.get('/attendance/history', TutorController.attendanceHistory);
router.get('/attendance/:id', TutorController.attendance);

/* POST */
router.post('/attendance/:id', TutorController.saveAttendance);

export default router;
