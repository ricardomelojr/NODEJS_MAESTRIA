import User from '../models/User.js';
import Availability from '../models/Availability.js';
import { Op } from 'sequelize';

export default class AvailabilityController {
  // Buscar monitores pelo nome
  static async searchMonitors(req, res) {
    const { query } = req.query;
    try {
      const monitors = await User.findAll({
        where: {
          name: { [Op.like]: `%${query}%` },
          role: 'Monitor',
        },
      });
      res.json(monitors);
    } catch (error) {
      console.error('Erro ao buscar monitores:', error);
      res.status(500).send('Erro no servidor');
    }
  }

  // Criar uma nova monitoria
  static async createTutoring(req, res) {
    const { monitor, subject, day, startTime, endTime } = req.body;
    try {
      // Buscar o monitor pelo nome
      const monitorUser = await User.findOne({
        where: { name: monitor, role: 'Monitor' },
      });
      if (!monitorUser) {
        req.flash('error_msg', 'Monitor não encontrado.');
        return res.redirect('/admin/createTutoring');
      }

      // Criar a monitoria na tabela Availability
      await Availability.create({
        subject,
        day,
        startTime,
        endTime,
        idUser: monitorUser.idUser,
      });

      req.flash('success_msg', 'Monitoria criada com sucesso.');
      res.redirect('/admin/tutors');
    } catch (error) {
      console.error('Erro ao criar monitoria:', error);
      req.flash('error_msg', 'Erro ao criar monitoria.');
      res.redirect('/admin/createTutoring');
    }
  }

  // Listar todas as monitorias
  static async listTutoring(req, res) {
    try {
      const availabilities = await Availability.findAll({
        include: {
          model: User,
          attributes: ['name'], // Incluir o nome do monitor (relacionamento com a tabela de usuários)
        },
      });

      res.render('admin/listTutoring', {
        title: 'Lista de Monitorias',
        availabilities, // Passa as monitorias para a view
        user: req.session.user, // Informações do usuário logado
        layout: 'main', // Usando o layout principal
      });
    } catch (error) {
      console.error('Erro ao listar monitorias:', error);
      req.flash('error_msg', 'Erro ao listar monitorias.');
      res.redirect('/admin/dashboard');
    }
  }
}
