import express from 'express';
const router = express.Router();

import TutorController from '../controllers/tutorController.js'; // Usando o nome "TutorController"
import {
  ensureMonitor,
  ensureAuthenticated,
} from '../middlewares/authMiddleware.js';

// Rota protegida para Tutor (Monitor)
router.get(
  '/dashboard',
  ensureAuthenticated,
  ensureMonitor,
  TutorController.tutorDashboard
);

export default router;
