import express from 'express';
import TaskController from '../controllers/TaskController.js';

const router = express.Router();

// Rotas GET
router.get('/', TaskController.showTasks); // Exibe todas as tarefas
router.get('/add', TaskController.createTask); // Renderiza a página de criação de tarefas
router.get('/edit/:id', TaskController.editTask); // Renderiza a página de edição de tarefas

// Rotas POST
router.post('/add', TaskController.createTaskSave); // Salva uma nova tarefa
router.post('/remove', TaskController.removeTask); // Remove uma tarefa
router.post('/update', TaskController.updateTask); // Atualiza uma tarefa existente
router.post('/updatestatus', TaskController.toggleTaskStatus); // Alterna o status de uma tarefa

export default router;
