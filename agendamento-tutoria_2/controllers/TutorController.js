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
    const { attendanceDate, attendance } = req.body;

    try {
      const existingRecord = await Attendance.findOne({
        where: { idAvailability: availabilityId, date: attendanceDate },
      });

      if (existingRecord) {
        return res
          .status(400)
          .json({ error: 'Não é permitido editar a lista de presenças para esta data, pois já foi registrada.' });
      }

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

      res.status(200).json({ message: 'Lista de presença salva com sucesso!' });
    } catch (error) {
      console.error('Erro ao salvar a lista de presença:', error);
      res.status(500).json({ error: 'Erro ao salvar a lista de presença.' });
    }
  }

  static async students(req, res) {
    const idAvailability = req.params.id;

    try {
      // Busca todos os alunos e suas respectivas presenças e faltas
      const studentsData = await Attendance.findAll({
        attributes: [
          'idUser',
          [sequelize.literal(`SUM(CASE WHEN status = 'presente' THEN 1 ELSE 0 END)`), 'presencas'],
          [sequelize.literal(`SUM(CASE WHEN status = 'ausente' THEN 1 ELSE 0 END)`), 'faltas'],
        ],
        where: { idAvailability: idAvailability },
        include: [
          {
            model: User,
            attributes: ['name'],
          },
        ],
        group: ['idUser', 'User.name'],
      });

      // Mapeia os dados para um formato mais simples
      const formattedStudentsData = studentsData.map((student) => ({
        name: student.User.name,
        presencas: student.get('presencas'),
        faltas: student.get('faltas'),
      }));

      res.render('tutor/students', {
        title: 'Lista de Alunos',
        students: formattedStudentsData, // Passa o array formatado
        layout: 'main',
      });
    } catch (error) {
      console.error('Erro ao carregar a lista de alunos:', error);
      req.flash('error_msg', 'Erro ao carregar a lista de alunos.');
      res.redirect('/tutor/dashboard');
    }
  }

  static async history(req, res) {
    const { idAvailability } = req.body;

    try {
      // Carregar dados do histórico com o idAvailability
      const historyDataRaw = await Attendance.findAll({ where: { idAvailability } });

      // Mapear e formatar as datas no backend usando Moment.js para ajustar o fuso horário
      const historyData = historyDataRaw.map((session) => ({
        ...session.toJSON(),
        formattedDate: moment(session.date).format('DD/MM/YYYY'), // Formatando para o horário local
      }));

      // Função para remover datas duplicadas
      const filterUniqueDates = (data) => {
        const uniqueDates = new Set();
        return data.filter((item) => {
          if (uniqueDates.has(item.formattedDate)) {
            return false; // Ignorar se a data já foi encontrada
          }
          uniqueDates.add(item.formattedDate);
          return true; // Incluir se for a primeira vez que essa data é encontrada
        });
      };

      // Filtrar datas duplicadas
      const filteredHistoryData = filterUniqueDates(historyData);

      /* console.log(filteredHistoryData); */

      // Renderizar a página com os dados filtrados
      res.render('tutor/history', { historyData: filteredHistoryData });
    } catch (error) {
      console.error('Erro ao carregar o histórico:', error);
      req.flash('error_msg', 'Erro ao carregar o histórico.');
      res.redirect('/tutor/dashboard');
    }
  }

  static async getSessionDetails(req, res) {
    const { idAvailability, date } = req.body;
    const [day, month, year] = date.split('/');

    try {
      // Ajusta a data para o formato YYYY-MM-DD
      const formattedDate = `${year}-${month}-${day}`;
      console.log(formattedDate);

      // Consulta os alunos presentes ou ausentes em uma sessão específica
      const students = await Attendance.findAll({
        where: {
          idAvailability,
          date: formattedDate, // Usando a data formatada
        },
        include: [
          {
            model: User,
            attributes: ['name'],
          },
        ],
      });

      // Prepara os dados para enviar como resposta
      const response = students.map((student) => ({
        studentName: student.User.name,
        status: student.status,
      }));

      res.json({ success: true, students: response });
    } catch (error) {
      console.error('Erro ao buscar detalhes da sessão:', error);
      res.json({ success: false, message: 'Erro ao buscar detalhes da sessão' });
    }
  }
}
