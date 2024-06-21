import express from 'express';
import TaskController from '../controllers/TaskController.js'; // Certifique-se de que o caminho está correto

const router = express.Router();

/* GET */
router.get('/', TaskController.showTasks);
router.get('/add', TaskController.createTask);
router.get('/edit/:id', TaskController.editTask);

/* POST */
router.post('/add', TaskController.createTaskSave);
router.post('/remove', TaskController.removeTask);
router.post('/update', TaskController.updateTask);

export default router;
