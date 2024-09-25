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

    // Validação dos campos obrigatórios
    if (!monitor || !subject || !day || !startTime || !endTime) {
      req.flash(
        'error_msg',
        'Todos os campos são obrigatórios. Por favor, preencha todos os dados.'
      );
      return res.redirect('/admin/availability');
    }

    try {
      // Buscar o monitor pelo nome
      const monitorUser = await User.findOne({
        where: { name: monitor, role: 'Monitor' },
      });

      if (!monitorUser) {
        req.flash('error_msg', 'Monitor não encontrado.');
        return res.redirect('/admin/availability');
      }

      // Verificar se já existe uma monitoria com horário sobreposto no mesmo dia
      const overlappingAvailability = await Availability.findOne({
        where: {
          idUser: monitorUser.idUser,
          day: day,
          [Op.or]: [
            {
              startTime: {
                [Op.between]: [startTime, endTime],
              },
            },
            {
              endTime: {
                [Op.between]: [startTime, endTime],
              },
            },
            {
              [Op.and]: [
                {
                  startTime: {
                    [Op.lte]: startTime,
                  },
                },
                {
                  endTime: {
                    [Op.gte]: endTime,
                  },
                },
              ],
            },
          ],
        },
      });

      if (overlappingAvailability) {
        req.flash(
          'error_msg',
          'O monitor já tem uma monitoria nesse intervalo de horário.'
        );
        return res.redirect('/admin/availability');
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
      res.redirect('/admin/availability');
    } catch (error) {
      console.error('Erro ao criar monitoria:', error);
      req.flash('error_msg', 'Erro ao criar monitoria.');
      res.redirect('/admin/availability');
    }
  }

  // Listar todas as monitorias e monitores (incluindo os sem disponibilidade)
  static async listTutoring(req, res) {
    try {
      // Buscar todos os monitores, mesmo sem disponibilidade
      const monitors = await User.findAll({
        where: { role: 'Monitor' },
        include: {
          model: Availability,
          required: false, // Incluir monitores sem disponibilidade
        },
      });

      res.render('admin/availability', {
        title: 'Lista de Monitorias',
        availabilities: monitors, // Passa os monitores (com ou sem disponibilidade) para a view
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
