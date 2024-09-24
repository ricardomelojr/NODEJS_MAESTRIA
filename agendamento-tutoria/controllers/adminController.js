import { Op } from 'sequelize'; // Para operações avançadas de busca
import User from '../models/User.js';
/* import Availability from '../models/Availability.js'; // Modelo de Disponibilidade */
import bcrypt from 'bcryptjs'; // Para lidar com a alteração de senha

export default class AdminController {
  // Exibe o dashboard do administrador
  static async dashboard(req, res) {
    try {
      const totalAlunos = await User.count({ where: { role: 'Aluno' } });
      const totalMonitores = await User.count({ where: { role: 'Monitor' } });
      const totalAdministradores = await User.count({
        where: { role: 'Administrador' },
      });

      res.render('admin/dashboard', {
        totalAlunos,
        totalMonitores,
        totalAdministradores,
        title: 'Dashboard do Administrador',
      });
    } catch (error) {
      req.flash('error_msg', 'Erro ao carregar o dashboard.');
      res.redirect('/');
    }
  }

  // Exibe todos os usuários com busca e filtragem
  static async listarUsuarios(req, res) {
    const { search, roleFilter } = req.query; // Pega os parâmetros de busca e filtro
    const where = {};

    // Filtragem por nome
    if (search) {
      where.name = { [Op.like]: `%${search}%` }; // Busca por nome usando "like"
    }

    // Filtragem por role
    if (
      roleFilter &&
      ['Aluno', 'Monitor', 'Administrador'].includes(roleFilter)
    ) {
      where.role = roleFilter;
    }

    try {
      const usuarios = await User.findAll({ where });
      res.render('admin/usuarios', {
        usuarios,
        title: 'Gerenciar Usuários',
        search, // Mantém o termo de busca na view
        roleFilter, // Mantém o filtro selecionado na view
      });
    } catch (error) {
      req.flash('error_msg', 'Erro ao carregar usuários.');
      res.redirect('/admin/dashboard');
    }
  }

  // Altera a role de um usuário
  static async alterarRole(req, res) {
    const { id } = req.params;
    const { role } = req.body;

    try {
      const user = await User.findByPk(id);
      if (!user) {
        req.flash('error_msg', 'Usuário não encontrado.');
        return res.redirect('/admin/usuarios');
      }

      user.role = role; // Atualiza a role do usuário
      await user.save();

      req.flash('success_msg', 'Role do usuário alterada com sucesso.');
      res.redirect('/admin/usuarios');
    } catch (error) {
      req.flash('error_msg', 'Erro ao alterar role do usuário.');
      res.redirect('/admin/usuarios');
    }
  }

  // Exibe o formulário de edição de um usuário
  static async editarUsuario(req, res) {
    try {
      const { id } = req.params;
      const usuario = await User.findByPk(id, {
        include: [{ model: Availability, as: 'availabilities' }], // Inclui as disponibilidades do usuário
      });

      if (!usuario) {
        req.flash('error_msg', 'Usuário não encontrado.');
        return res.redirect('/admin/usuarios');
      }

      // Organiza as disponibilidades para enviar à view
      const availabilityMap = {};
      if (usuario.availabilities) {
        usuario.availabilities.forEach(availability => {
          availabilityMap[availability.day.toLowerCase()] = availability;
        });
      }

      res.render('admin/editarUsuario', {
        usuario,
        availabilityMap, // Mapa de dias e horários para a view
        title: 'Editar Usuário',
      });
    } catch (error) {
      req.flash('error_msg', 'Erro ao carregar a página de edição.');
      res.redirect('/admin/usuarios');
    }
  }

  // Atualiza as informações de um usuário
  static async atualizarUsuario(req, res) {
    const { id } = req.params;
    const { name, email, role, password, confirmPassword, subject } = req.body;

    // Dias da semana e horários recebidos do formulário
    const daysWithTimes = {
      monday: { start: req.body.mondayStart, end: req.body.mondayEnd },
      tuesday: { start: req.body.tuesdayStart, end: req.body.tuesdayEnd },
      wednesday: { start: req.body.wednesdayStart, end: req.body.wednesdayEnd },
      thursday: { start: req.body.thursdayStart, end: req.body.thursdayEnd },
      friday: { start: req.body.fridayStart, end: req.body.fridayEnd },
    };

    try {
      const usuario = await User.findByPk(id);
      if (!usuario) {
        req.flash('error_msg', 'Usuário não encontrado.');
        return res.redirect('/admin/usuarios');
      }

      // Atualiza os dados do usuário
      usuario.name = name;
      usuario.email = email;
      usuario.role = role;
      usuario.subject = subject;

      // Alterar senha se estiver presente e igual
      if (password && password === confirmPassword) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);
      } else if (password && password !== confirmPassword) {
        req.flash('error_msg', 'As senhas não coincidem.');
        return res.redirect(`/admin/usuarios/${id}/editar`);
      }

      await usuario.save();

      // Atualiza as disponibilidades (se o usuário for Monitor)
      if (role === 'Monitor') {
        // Remove todas as disponibilidades existentes para este monitor
        await Availability.destroy({ where: { userId: usuario.id } });

        // Adiciona novas disponibilidades baseadas nos campos recebidos do formulário
        for (const [day, times] of Object.entries(daysWithTimes)) {
          if (times.start && times.end) {
            await Availability.create({
              day: day.charAt(0).toUpperCase() + day.slice(1), // Capitaliza o dia
              startTime: times.start,
              endTime: times.end,
              userId: usuario.id,
            });
          }
        }
      }

      req.flash('success_msg', 'Usuário atualizado com sucesso.');
      res.redirect('/admin/usuarios');
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Erro ao atualizar usuário.');
      res.redirect('/admin/usuarios');
    }
  }

  // Exclui um usuário
  static async excluirUsuario(req, res) {
    const { id } = req.params;

    try {
      const usuario = await User.findByPk(id);
      if (!usuario) {
        req.flash('error_msg', 'Usuário não encontrado.');
        return res.redirect('/admin/usuarios');
      }

      if (usuario.id === req.session.user.id) {
        req.flash('error_msg', 'Você não pode excluir sua própria conta.');
        return res.redirect('/admin/usuarios');
      }

      await usuario.destroy();
      req.flash('success_msg', 'Usuário excluído com sucesso.');
      res.redirect('/admin/usuarios');
    } catch (error) {
      req.flash('error_msg', 'Erro ao excluir usuário.');
      res.redirect('/admin/usuarios');
    }
  }
}
