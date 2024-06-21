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

  // Exibe todas as tarefas
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

  // Salva uma nova tarefa
  static async createTaskSave(req, res) {
    const task = {
      title: req.body.title,
      description: req.body.description,
      done: false,
    };

    await Task.create(task);
    res.redirect('/tasks');
  }

  // Remove uma tarefa
  static async removeTask(req, res) {
    const id = req.body.id;

    await Task.destroy({ where: { id: id } });
    res.redirect('/tasks'); // Adiciona um redirecionamento após a remoção
  }

  static async editTask(req, res) {
    try {
      const id = req.params.id; // id vem pela URL

      // Encontrar a tarefa pelo id
      const task = await Task.findOne({ where: { id: id } });

      if (task) {
        // Convertendo o objeto Sequelize para um objeto simples
        const plainTask = task.get({ plain: true });

        // Renderizando a página de edição com a tarefa
        res.render('tasks/edit', { task: plainTask });
      } else {
        // Lidar com o caso onde a tarefa não é encontrada
        res.status(404).send('Tarefa não encontrada');
      }
    } catch (error) {
      // Lidar com possíveis erros
      console.error('Erro ao buscar a tarefa:', error);
      res.status(500).send('Erro no servidor');
    }
  }

  static async updateTask(req, res) {
    const { id, title, description } = req.body;

    await Task.update(
      { title: title, description: description },
      {
        where: {
          id: id,
        },
      }
    );
    res.redirect('/tasks');
  }
}
