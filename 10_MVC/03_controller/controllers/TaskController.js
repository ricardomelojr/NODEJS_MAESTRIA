import Task from '../models/Task'; // Verifique se o caminho está correto

export default class TaskController {
  static createTask(req, res) {
    try {
      res.render('tasks/create'); // Certifique-se de que 'tasks/create' é o caminho correto para a sua view
    } catch (error) {
      res.status(500).send('Erro ao renderizar a página de criação de tarefas');
    }
  }
}
