import Task from '../models/Task.js'; // Verifique o caminho do modelo

export default class TaskController {
  static createTask(req, res) {
    try {
      res.render('tasks/create'); // Certifique-se de que a view 'tasks/create' existe
    } catch (error) {
      console.error(
        'Erro ao renderizar a página de criação de tarefas:',
        error
      );
      res.status(500).send('Erro ao renderizar a página de criação de tarefas');
    }
  }

  static async showTasks(req, res) {
    try {
      res.render('tasks/all'); // Certifique-se de que a view 'tasks/all' existe e espera um array de tarefas
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      res.status(500).send('Erro ao renderizar a página de tarefas');
    }
  }
}
