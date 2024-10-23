import User from '../models/User.js'; // Certifique-se de ajustar o caminho conforme necessário

export default class AdminController {
  // Exibir o dashboard do administrador
  static dashboard(req, res) {
    try {
      res.render('admin/dashboard', {
        title: 'Dashboard do Administrador',
        user: req.session.user, // Informações do usuário logado
        layout: 'main', // Usando o layout principal
      });
    } catch (error) {
      console.error('Erro ao carregar o dashboard:', error);
      req.flash('error_msg', 'Erro ao carregar o dashboard.');
      res.redirect('/');
    }
  }

  // Renderizar página de criação de monitoria
  static createTutoring(req, res) {
    try {
      res.render('admin/createTutoring', {
        title: 'Cadastrar Monitoria',
        user: req.session.user, // Informações do usuário logado
        layout: 'main', // Usando o layout principal
      });
    } catch (error) {
      console.error('Erro ao carregar a página de criação de monitoria:', error);
      req.flash('error_msg', 'Erro ao carregar a página de criação de monitoria.');
      res.redirect('/admin/dashboard');
    }
  }

  // Listar todos os tutores (monitores)
  static async listTutors(req, res) {
    try {
      const users = await User.findAll({
        where: { role: 'Monitor' }, // Filtrar apenas os monitores
      });

      // Renderiza a página passando os monitores para a view
      res.render('admin/tutors', {
        title: 'Lista de Monitores',
        users, // Passa os monitores para a view
        user: req.session.user, // Informações do usuário logado
        layout: 'main', // Usando o layout principal
      });
    } catch (error) {
      console.error('Erro ao listar os monitores:', error);
      req.flash('error_msg', 'Erro ao listar os monitores.');
      res.redirect('/admin/dashboard');
    }
  }

  // Listar todos os usuários
  static async listUsers(req, res) {
    try {
      const users = await User.findAll(); // Recupera todos os usuários do banco de dados

      res.render('admin/users', {
        title: 'Lista de Usuários',
        users, // Passa a lista de usuários para a view
        user: req.session.user, // Informações do usuário logado
        layout: 'main', // Usando o layout principal
      });
    } catch (error) {
      console.error('Erro ao carregar a lista de usuários:', error);
      req.flash('error_msg', 'Erro ao carregar a lista de usuários.');
      res.redirect('/admin/dashboard');
    }
  }

  // Atualizar a função do usuário
  static async updateUserRole(req, res) {
    try {
      const { idUser } = req.params;
      const { role } = req.body;

      // Atualizar o papel do usuário no banco de dados
      await User.update({ role }, { where: { idUser } });

      req.flash('success_msg', 'Função do usuário atualizada com sucesso.');
      res.redirect('/admin/users');
    } catch (error) {
      console.error('Erro ao atualizar a função do usuário:', error);
      req.flash('error_msg', 'Erro ao atualizar a função do usuário.');
      res.redirect('/admin/users');
    }
  }
}
