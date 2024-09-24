import express from 'express';
import AvailabilityController from '../controllers/AvailabilityController.js';

const router = express.Router();

// Rota para buscar monitores pelo nome
router.get('/search', AvailabilityController.searchMonitors);

// Rota para criar uma nova monitoria
router.post('/create', AvailabilityController.createTutoring);

// Rota para listar todas as monitorias
router.get('/list', AvailabilityController.listTutoring);

export default router;
