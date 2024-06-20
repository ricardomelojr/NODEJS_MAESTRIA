import Task from '../models/Task.js';

export default class TaskController {
  static createTask(req, res) {
    try {
      res.render('tasks/create');
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
      const tasks = await Task.findAll();
      const plainTasks = tasks.map(task => task.get({ plain: true }));
      res.render('tasks/all', { tasks: plainTasks });
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      res.status(500).send('Erro ao renderizar a página de tarefas');
    }
  }

  static async createTaskSave(req, res) {
    const task = {
      title: req.body.title,
      description: req.body.description,
      done: false,
    };

    await Task.create(task);
    res.redirect('/tasks');
  }
}
