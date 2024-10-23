import sequelize from '../config/database.js';
import Availability from '../models/Availability.js';
import Tutoring from '../models/Tutoring.js';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import { Op } from 'sequelize';
import { formatTime } from '../utils/utils.js';
import moment from 'moment'; // Certifique-se de instalar a biblioteca moment.js se ainda não estiver instalada

export default class TutorController {
  static dashboard(req, res) {
    try {
      res.render('tutor/dashboard', {
        title: 'Dashboard do Monitor',
        user: req.session.user,
        layout: 'main',
      });
    } catch (error) {
      console.error('Erro ao carregar o dashboard do monitor:', error);
      req.flash('error_msg', 'Erro ao carregar o dashboard.');
      res.redirect('/');
    }
  }

  static async schedule(req, res) {
    try {
      const tutorId = req.session.user.id;

      // Busca as disponibilidades do tutor
      const availabilities = await Availability.findAll({
        where: { idUser: tutorId },
        include: [
          {
            model: Tutoring,
            include: {
              model: User,
              attributes: ['name'],
            },
          },
        ],
      });

      // Formatar a informação de disponibilidade
      const scheduleData = availabilities.map((availability) => ({
        id: availability.id,
        day: availability.day,
        startTime: formatTime(availability.startTime),
        endTime: formatTime(availability.endTime),
        studentCount: availability.Tutorings.length,
      }));

      res.render('tutor/schedule', {
        title: 'Minhas Sessões',
        availabilities: scheduleData,
        user: req.session.user,
        layout: 'main',
      });
    } catch (error) {
      console.error('Erro ao carregar a agenda de monitorias:', error);
      req.flash('error_msg', 'Erro ao carregar a agenda de monitorias.');
      res.redirect('/tutor/dashboard');
    }
  }

  static async attendance(req, res) {
    try {
      const availabilityId = parseInt(req.params.id, 10);
      if (isNaN(availabilityId)) {
        req.flash('error_msg', 'ID de disponibilidade inválido.');
        return res.redirect('/tutor/dashboard');
      }

      // Busca todos os alunos matriculados na tutoria específica (availabilityId)
      const students = await User.findAll({
        include: {
          model: Tutoring,
          where: { idAvailability: availabilityId },
          include: {
            model: Availability,
            attributes: [], // Não precisamos dos dados de disponibilidade diretamente
          },
        },
        attributes: ['idUser', 'name'], // Escolha os atributos que deseja passar
      });

      // Obtém a data atual
      const currentDate = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

      // Renderiza a página de presença e passa a lista de alunos
      res.render('tutor/attendance', {
        title: 'Gerenciar Presença',
        students: students,
        currentDate: currentDate, // Passa a data atual para o template
        user: req.session.user,
        idAvailability: availabilityId,
        layout: 'main',
      });
    } catch (error) {
      console.error('Erro ao carregar a lista de presença:', error);
      req.flash('error_msg', 'Erro ao carregar a lista de presença.');
      res.redirect('/tutor/dashboard');
    }
  }

  static async saveAttendance(req, res) {
    const availabilityId = req.params.id;
    const { attendanceDate, attendance } = req.body; // JSON enviado pelo fetch

    try {
      // Loop para salvar a presença ou ausência de cada aluno
      await Promise.all(
        Object.entries(attendance).map(async ([userId, status]) => {
          const existingRecord = await Attendance.findOne({
            where: { idUser: userId, idAvailability: availabilityId, date: attendanceDate },
          });

          if (existingRecord) {
            await Attendance.update(
              { status },
              { where: { idUser: userId, idAvailability: availabilityId, date: attendanceDate } }
            );
          } else {
            await Attendance.create({
              idUser: userId,
              idAvailability: availabilityId,
              date: attendanceDate,
              status,
            });
          }
        })
      );

      // Usar req.flash para enviar uma mensagem de sucesso
      req.flash('success_msg', 'Lista de presença salva com sucesso!');
      res.status(200).json({ message: 'Presença salva com sucesso!' });
    } catch (error) {
      console.error('Erro ao salvar a lista de presença:', error);

      // Usar req.flash para enviar uma mensagem de erro
      req.flash('error_msg', 'Erro ao salvar a lista de presença.');
      res.status(500).json({ error: 'Erro ao salvar a lista de presença.' });
    }
  }

  static async attendanceHistory(req, res) {
    try {
      const tutorId = req.session.user?.id;
      if (!tutorId) {
        req.flash('error_msg', 'Sessão do tutor não encontrada.');
        return res.redirect('/login');
      }

      // Paginação
      const limit = 10; // Número de sessões por página
      const offset = req.query.page ? (req.query.page - 1) * limit : 0;

      // Buscar todas as disponibilidades (sessões) desse tutor, incluindo a presença dos alunos
      const sessions = await Availability.findAll({
        where: { idUser: tutorId }, // Filtra as sessões do tutor
        limit,
        offset,
        attributes: ['id', 'day'], // Seleciona apenas as colunas necessárias
      });

      // Formatar as informações de sessões para passar para o template
      const historyData = sessions.map((session) => ({
        day: moment(session.day).format('YYYY-MM-DD'), // Formato da data
        id: session.id, // Para possível uso futuro
      }));

      // Renderizar a página de histórico com os dados formatados
      res.render('tutor/history', {
        title: 'Histórico de Sessões',
        history: historyData, // Passa o formato correto para o template
        user: req.session.user,
        layout: 'main',
      });
    } catch (error) {
      console.error('Erro ao carregar o histórico de sessões:', error);
      req.flash('error_msg', 'Erro ao carregar o histórico de sessões.');
      res.redirect('/tutor/dashboard');
    }
  }
}
