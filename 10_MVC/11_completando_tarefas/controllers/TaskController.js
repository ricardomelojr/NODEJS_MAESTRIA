import Task from '../models/Task.js';

export default class TaskController {
  // Renderiza a página de criação de tarefas
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
    try {
      const task = {
        title: req.body.title,
        description: req.body.description,
        done: false,
      };
      await Task.create(task);
      res.redirect('/tasks');
    } catch (error) {
      console.error('Erro ao salvar a tarefa:', error);
      res.status(500).send('Erro ao salvar a tarefa');
    }
  }

  // Remove uma tarefa
  static async removeTask(req, res) {
    try {
      const id = req.body.id;
      await Task.destroy({ where: { id: id } });
      res.redirect('/tasks');
    } catch (error) {
      console.error('Erro ao remover a tarefa:', error);
      res.status(500).send('Erro ao remover a tarefa');
    }
  }

  // Renderiza a página de edição de tarefas
  static async editTask(req, res) {
    try {
      const id = req.params.id;
      const task = await Task.findOne({ where: { id: id } });

      if (task) {
        const plainTask = task.get({ plain: true });
        res.render('tasks/edit', { task: plainTask });
      } else {
        res.status(404).send('Tarefa não encontrada');
      }
    } catch (error) {
      console.error('Erro ao buscar a tarefa:', error);
      res.status(500).send('Erro no servidor');
    }
  }

  // Atualiza uma tarefa
  static async updateTask(req, res) {
    try {
      const { id, title, description } = req.body;
      await Task.update({ title, description }, { where: { id } });
      res.redirect('/tasks');
    } catch (error) {
      console.error('Erro ao atualizar a tarefa:', error);
      res.status(500).send('Erro ao atualizar a tarefa');
    }
  }

  // Alterna o status de uma tarefa
  static async toggleTaskStatus(req, res) {
    try {
      const id = req.body.id;
      const task = await Task.findOne({ where: { id: id } });

      if (task) {
        const newStatus = !task.done;
        await Task.update({ done: newStatus }, { where: { id } });
        res.redirect('/tasks');
      } else {
        res.status(404).send('Tarefa não encontrada');
      }
    } catch (error) {
      console.error('Erro ao alternar o status da tarefa:', error);
      res.status(500).send('Erro ao alternar o status da tarefa');
    }
  }
}
