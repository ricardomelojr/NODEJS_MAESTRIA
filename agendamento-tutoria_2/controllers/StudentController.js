import { Op } from 'sequelize';
import User from '../models/User.js';
import Availability from '../models/Availability.js';
import Tutoring from '../models/Tutoring.js';

export default class StudentController {
  // Exibir o dashboard do aluno
  static dashboard(req, res) {
    try {
      res.render('student/dashboard', {
        title: 'Dashboard do Aluno',
        user: req.session.user,
        layout: 'main',
      });
    } catch (error) {
      console.error('Erro ao carregar o dashboard do aluno:', error);
      req.flash('error_msg', 'Erro ao carregar o dashboard.');
      res.redirect('/');
    }
  }

  // Listar monitores e suas disponibilidades
  static async tutors(req, res) {
    const studentId = req.session.user.id;
    try {
      const tutors = await User.findAll({
        where: { role: 'Monitor' },
        include: [
          {
            model: Availability,
            required: true,
          },
        ],
      });

      const registeredTutoring = await Tutoring.findAll({
        where: { idUser: studentId },
        attributes: ['idAvailability'],
      });

      const registeredIds = registeredTutoring.map(tutoring =>
        Number(tutoring.idAvailability)
      );

      tutors.forEach(tutor => {
        tutor.Availabilities.forEach(availability => {
          availability.isRegistered = registeredIds.includes(availability.id);
        });
      });

      res.render('student/tutors', {
        title: 'Lista de Monitores',
        tutors,
        user: req.session.user,
        layout: 'main',
      });
    } catch (error) {
      console.error('Erro ao listar monitores e disponibilidades:', error);
      req.flash('error_msg', 'Erro ao listar monitores.');
      res.redirect('/student/dashboard');
    }
  }

  // Inscrição em uma monitoria
  static async registerTutoring(req, res) {
    const { idAvailability } = req.body;
    const studentId = req.session.user.id;

    try {
      // Verificar se a inscrição já existe
      const existingTutoring = await Tutoring.findOne({
        where: { idUser: studentId, idAvailability },
      });

      if (existingTutoring) {
        req.flash('error_msg', 'Você já está inscrito nesta monitoria.');
        return res.redirect('/student/tutors');
      }

      // Buscar a disponibilidade selecionada
      const selectedAvailability = await Availability.findByPk(idAvailability);

      // Verificar se o aluno já tem uma monitoria no mesmo horário e dia
      const overlappingTutoring = await Tutoring.findOne({
        where: { idUser: studentId },
        include: {
          model: Availability,
          where: {
            day: selectedAvailability.day,
            [Op.or]: [
              {
                startTime: {
                  [Op.between]: [
                    selectedAvailability.startTime,
                    selectedAvailability.endTime,
                  ],
                },
              },
              {
                endTime: {
                  [Op.between]: [
                    selectedAvailability.startTime,
                    selectedAvailability.endTime,
                  ],
                },
              },
              {
                [Op.and]: [
                  {
                    startTime: {
                      [Op.lte]: selectedAvailability.startTime,
                    },
                  },
                  {
                    endTime: {
                      [Op.gte]: selectedAvailability.endTime,
                    },
                  },
                ],
              },
            ],
          },
        },
      });

      if (overlappingTutoring) {
        req.flash(
          'error_msg',
          'Você já está inscrito em uma monitoria nesse horário.'
        );
        return res.redirect('/student/tutors');
      }

      // Criar a inscrição na monitoria
      await Tutoring.create({
        idUser: studentId,
        idAvailability: Number(idAvailability),
      });

      req.flash('success_msg', 'Inscrição realizada com sucesso na monitoria.');
      res.redirect('/student/tutors');
    } catch (error) {
      console.error('Erro ao realizar inscrição na monitoria:', error);
      req.flash('error_msg', 'Erro ao realizar a inscrição.');
      res.redirect('/student/tutors');
    }
  }
}
