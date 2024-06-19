import express from 'express';
import TaskController from '../controllers/TaskController.js'; // Certifique-se de que o caminho está correto

const router = express.Router();

router.get('/', TaskController.showTasks);
router.get('/add', TaskController.createTask);

export default router;
