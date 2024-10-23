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
      // Verifica se já existe um registro de presença para a data especificada
      const existingRecord = await Attendance.findOne({
        where: { idAvailability: availabilityId, date: attendanceDate },
      });

      // Se já existe um registro, não permite a edição
      if (existingRecord) {
        req.flash('error_msg', 'Não é permitido editar a lista de presenças para esta data, pois já foi registrada.');
        return res
          .status(400)
          .json({ error: 'Não é permitido editar a lista de presenças para esta data, pois já foi registrada.' });
      }

      // Loop para salvar a presença ou ausência de cada aluno
      await Promise.all(
        Object.entries(attendance).map(async ([userId, status]) => {
          await Attendance.create({
            idUser: userId,
            idAvailability: availabilityId,
            date: attendanceDate,
            status,
          });
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
      // Obtém o ID do tutor da sessão
      const tutorId = req.session.user.id;

      if (!tutorId) {
        req.flash('error_msg', 'Sessão do tutor não encontrada.');
        return res.redirect('/login');
      }

      const attendanceHistory = await Attendance.findAll({
        attributes: [
          'date', // Atributo 'date' das sessões de monitoria
          'idAvailability', // Atributo 'idAvailability' relacionado a cada sessão
        ],
        where: {
          '$Availability.idUser$': tutorId, // Filtra pelo ID do tutor
        },
        include: [
          {
            model: Availability,
            attributes: ['subject'], // Inclui o atributo 'subject' da model Availability
          },
        ],
        group: ['date', 'idAvailability'], // Agrupar por data e idAvailability
        order: [['date', 'DESC']], // Ordenar pela data mais recente
      });

      // Verifica se há sessões no histórico
      if (!attendanceHistory.length) {
        req.flash('info_msg', 'Nenhuma sessão registrada.');
        return res.redirect('/tutor/dashboard');
      }

      // Função para formatar a data no formato dd/mm/yyyy
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam do zero
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      // Formata as datas e adiciona o subject antes de enviar para o template
      const formattedAttendanceHistory = attendanceHistory.map((session) => ({
        ...session.get(),
        date: formatDate(session.date),
        subject: session.Availability.subject, // Adiciona o subject à sessão
      }));

      // Renderiza a página de histórico, passando o histórico das sessões
      res.render('tutor/history', {
        title: 'Histórico de Sessões',
        sessions: formattedAttendanceHistory, // Passa o histórico de sessões formatadas para o template
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
